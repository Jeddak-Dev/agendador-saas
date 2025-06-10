from rest_framework import viewsets, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken

from django.db.models import Q
from django.utils import timezone
from datetime import timedelta, date, time

from .models import CustomUser, Establishment, Service, Professional, Appointment, Availability, Holiday, Payment, Notification
from .serializers import (
    CustomUserSerializer, RegisterSerializer, EstablishmentSerializer,
    ServiceSerializer, ProfessionalSerializer, AppointmentSerializer,
    AvailabilitySerializer, HolidaySerializer, PaymentSerializer, NotificationSerializer
)
from .permissions import IsOwnerOrAdminReadOnly, IsOwner, IsEstablishmentAdmin, IsClient, IsOwnerOrAdmin

import mercadopago # SDK do Mercado Pago
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)

# Configuração do Mercado Pago
mp = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": CustomUserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def me(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsOwnerOrAdmin] # Permissão customizada

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return CustomUser.objects.all()
        # Admins só podem ver usuários do seu estabelecimento ou o próprio
        elif user.is_admin and hasattr(user, 'professional_profile') and user.professional_profile.establishment:
            establishment_users = CustomUser.objects.filter(
                Q(establishments__owner=user) |
                Q(professional_profile__establishment=user.professional_profile.establishment) |
                Q(appointments_as_client__establishment=user.professional_profile.establishment)
            ).distinct()
            return CustomUser.objects.filter(Q(id=user.id) | Q(id__in=establishment_users))
        return CustomUser.objects.filter(id=user.id) # Cliente só vê o próprio

    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            self.permission_classes = [IsOwnerOrAdmin | IsClient] # Admin/Owner ou o próprio usuário
        elif self.action in ['list', 'create', 'destroy']:
            self.permission_classes = [IsOwnerOrAdmin] # Apenas admin/owner
        return super().get_permissions()


class EstablishmentViewSet(viewsets.ModelViewSet):
    queryset = Establishment.objects.all()
    serializer_class = EstablishmentSerializer
    permission_classes = [AllowAny] # Pode ser mais restrito para criação/atualização

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsOwner] # Apenas proprietários podem criar/alterar/deletar estabelecimentos
        return super().get_permissions()

    def perform_create(self, serializer):
        # Garante que o owner seja o usuário logado
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=['get'], url_path='services')
    def get_establishment_services(self, request, pk=None):
        establishment = self.get_object()
        services = establishment.services.filter(active=True)
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='professionals')
    def get_establishment_professionals(self, request, pk=None):
        establishment = self.get_object()
        professionals = establishment.professionals.filter(active=True)
        serializer = ProfessionalSerializer(professionals, many=True)
        return Response(serializer.data)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsOwnerOrAdminReadOnly] # Proprietário/Admin podem editar, outros só ler

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return Service.objects.all()
        elif user.is_admin and hasattr(user, 'professional_profile') and user.professional_profile.establishment:
            return Service.objects.filter(establishment=user.professional_profile.establishment)
        return Service.objects.all() # Para clientes, mostrar todos os serviços públicos

class ProfessionalViewSet(viewsets.ModelViewSet):
    queryset = Professional.objects.all()
    serializer_class = ProfessionalSerializer
    permission_classes = [IsOwnerOrAdminReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return Professional.objects.all()
        elif user.is_admin and hasattr(user, 'professional_profile') and user.professional_profile.establishment:
            return Professional.objects.filter(establishment=user.professional_profile.establishment)
        return Professional.objects.all() # Para clientes, mostrar todos os profissionais públicos

    @action(detail=True, methods=['get'], url_path='available-slots')
    def available_slots(self, request, pk=None):
        professional = self.get_object()
        establishment = professional.establishment

        # Parâmetros de data
        start_date_str = request.query_params.get('start_date')
        end_date_str = request.query_params.get('end_date')

        if not start_date_str or not end_date_str:
            return Response({"error": "start_date e end_date são obrigatórios."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_date = timezone.datetime.strptime(start_date_str, '%Y-%m-%d').date()
            end_date = timezone.datetime.strptime(end_date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Formato de data inválido. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

        slots = {}
        current_date = start_date
        while current_date <= end_date:
            day_of_week = current_date.weekday() # 0=Segunda, 6=Domingo
            # Ajuste para a representação do Django (Domingo=0, Segunda=1, etc.)
            django_day_of_week = (day_of_week + 1) % 7

            # Verificar feriados
            is_holiday = Holiday.objects.filter(establishment=establishment, date=current_date).exists()
            if is_holiday:
                current_date += timedelta(days=1)
                continue

            # Buscar disponibilidades do profissional para o dia da semana
            availabilities = Availability.objects.filter(
                professional=professional,
                day_of_week=django_day_of_week
            ).order_by('start_time')

            day_slots = []
            for availability in availabilities:
                current_slot_start = timezone.datetime.combine(current_date, availability.start_time, tzinfo=timezone.utc)
                availability_end = timezone.datetime.combine(current_date, availability.end_time, tzinfo=timezone.utc)

                # Obter agendamentos existentes que se sobrepõem
                booked_appointments = Appointment.objects.filter(
                    professional=professional,
                    start_time__lt=availability_end,
                    end_time__gt=current_slot_start,
                    status__in=['SCHEDULED', 'CONFIRMED', 'PENDING_PAYMENT'] # Considerar agendamentos pendentes de pagamento como ocupados
                ).order_by('start_time')

                last_booked_end = current_slot_start

                for booked_appointment in booked_appointments:
                    # Adicionar slot antes do agendamento
                    if booked_appointment.start_time > last_booked_end:
                        day_slots.append({
                            'start': last_booked_end.isoformat(),
                            'end': booked_appointment.start_time.isoformat(),
                        })
                    last_booked_end = max(last_booked_end, booked_appointment.end_time)

                # Adicionar slot após o último agendamento (se houver espaço)
                if availability_end > last_booked_end:
                    day_slots.append({
                        'start': last_booked_end.isoformat(),
                        'end': availability_end.isoformat(),
                    })
            
            # Filtra slots que não são válidos (ex: start >= end)
            day_slots = [slot for slot in day_slots if timezone.datetime.fromisoformat(slot['start']) < timezone.datetime.fromisoformat(slot['end'])]

            # Juntar slots adjacentes
            merged_slots = []
            if day_slots:
                day_slots.sort(key=lambda x: timezone.datetime.fromisoformat(x['start']))
                current_merged_slot = timezone.datetime.fromisoformat(day_slots[0]['start']), timezone.datetime.fromisoformat(day_slots[0]['end'])
                for i in range(1, len(day_slots)):
                    next_start = timezone.datetime.fromisoformat(day_slots[i]['start'])
                    next_end = timezone.datetime.fromisoformat(day_slots[i]['end'])

                    # Se o próximo slot se sobrepõe ou é contíguo (ex: começa imediatamente após o anterior termina)
                    if next_start <= current_merged_slot[1]:
                        current_merged_slot = current_merged_slot[0], max(current_merged_slot[1], next_end)
                    else:
                        merged_slots.append({
                            'start': current_merged_slot[0].isoformat(),
                            'end': current_merged_slot[1].isoformat(),
                        })
                        current_merged_slot = next_start, next_end
                merged_slots.append({
                    'start': current_merged_slot[0].isoformat(),
                    'end': current_merged_slot[1].isoformat(),
                })

            slots[current_date.isoformat()] = merged_slots
            current_date += timedelta(days=1)

        return Response(slots)

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated] # Base para todos

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return Appointment.objects.all()
        elif user.is_admin: # Admins veem agendamentos do seu estabelecimento
            if hasattr(user, 'professional_profile') and user.professional_profile.establishment:
                return Appointment.objects.filter(establishment=user.professional_profile.establishment)
            return Appointment.objects.none() # Admin sem estabelecimento não vê nada
        elif user.is_client: # Clientes veem apenas seus próprios agendamentos
            return Appointment.objects.filter(client=user)
        return Appointment.objects.none()

    def perform_create(self, serializer):
        # Garante que o cliente seja o usuário logado e o profissional pertença ao estabelecimento
        if not self.request.user.is_client:
            raise serializers.ValidationError({"detail": "Apenas clientes podem criar agendamentos."})

        professional = serializer.validated_data['professional']
        service = serializer.validated_data['service']
        start_time = serializer.validated_data['start_time']

        if professional.establishment != service.establishment:
            raise serializers.ValidationError({"detail": "O serviço não pertence ao estabelecimento do profissional."})

        # Verifica sobreposição de agendamentos
        end_time = start_time + timedelta(minutes=service.duration_minutes)
        if Appointment.objects.filter(
            professional=professional,
            start_time__lt=end_time,
            end_time__gt=start_time,
            status__in=['SCHEDULED', 'CONFIRMED', 'PENDING_PAYMENT']
        ).exists():
            raise serializers.ValidationError({"detail": "O horário selecionado não está disponível."})

        serializer.save(client=self.request.user, establishment=professional.establishment)


    def get_permissions(self):
        if self.action == 'create':
            self.permission_classes = [IsClient]
        elif self.action in ['retrieve', 'update', 'partial_update']:
            self.permission_classes = [IsOwnerOrAdmin | IsClient] # Owner/Admin ou o próprio cliente do agendamento
        elif self.action == 'destroy':
            self.permission_classes = [IsOwnerOrAdmin] # Apenas Owner/Admin podem deletar
        return super().get_permissions()

    @action(detail=True, methods=['post'], url_path='cancel', permission_classes=[IsAuthenticated])
    def cancel_appointment(self, request, pk=None):
        appointment = self.get_object()
        user = request.user

        # Permissões: Owner/Admin do estabelecimento ou o próprio cliente
        if user.is_owner or user.is_admin and user.professional_profile.establishment == appointment.establishment:
            pass # Permitido
        elif user.is_client and appointment.client == user:
            pass # Permitido
        else:
            return Response({"detail": "Você não tem permissão para cancelar este agendamento."}, status=status.HTTP_403_FORBIDDEN)

        if appointment.status in ['COMPLETED', 'CANCELED', 'NO_SHOW']:
            return Response({"detail": "Agendamento já está em um status final e não pode ser cancelado."}, status=status.HTTP_400_BAD_REQUEST)

        appointment.status = 'CANCELED'
        appointment.save()
        # TODO: Implementar lógica de estorno se já pago
        Notification.objects.create(
            user=appointment.client,
            message=f"Seu agendamento para {appointment.service.name} em {appointment.start_time.strftime('%d/%m/%Y %H:%M')} foi cancelado.",
            type='APPOINTMENT_CANCELLATION'
        )
        return Response(AppointmentSerializer(appointment).data, status=status.HTTP_200_OK)

class AvailabilityViewSet(viewsets.ModelViewSet):
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsOwnerOrAdmin] # Apenas proprietários ou admins podem gerenciar

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return Availability.objects.all()
        elif user.is_admin and hasattr(user, 'professional_profile') and user.professional_profile.establishment:
            # Admins veem disponibilidades de profissionais do seu estabelecimento
            return Availability.objects.filter(professional__establishment=user.professional_profile.establishment)
        return Availability.objects.none()

class HolidayViewSet(viewsets.ModelViewSet):
    queryset = Holiday.objects.all()
    serializer_class = HolidaySerializer
    permission_classes = [IsOwnerOrAdmin] # Apenas proprietários ou admins podem gerenciar

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return Holiday.objects.all()
        elif user.is_admin and hasattr(user, 'professional_profile') and user.professional_profile.establishment:
            return Holiday.objects.filter(establishment=user.professional_profile.establishment)
        return Holiday.objects.none()


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsOwnerOrAdmin] # Apenas proprietários ou admins podem ver detalhes de pagamento

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_owner:
            return Payment.objects.all()
        elif user.is_admin and hasattr(user, 'professional_profile') and user.professional_profile.establishment:
            return Payment.objects.filter(appointment__establishment=user.professional_profile.establishment)
        return Payment.objects.none()

    @action(detail=False, methods=['post'], url_path='create-preference', permission_classes=[IsAuthenticated])
    def create_preference(self, request):
        appointment_id = request.data.get('appointment_id')
        try:
            appointment = Appointment.objects.get(id=appointment_id, client=request.user)
        except Appointment.DoesNotExist:
            return Response({"detail": "Agendamento não encontrado ou não pertence a este usuário."}, status=status.HTTP_404_NOT_FOUND)

        if appointment.payment_status == 'PAID':
            return Response({"detail": "Este agendamento já foi pago."}, status=status.HTTP_400_BAD_REQUEST)

        # Dados do item para o Mercado Pago
        item_data = {
            "title": appointment.service.name,
            "quantity": 1,
            "unit_price": float(appointment.total_amount),
            "currency_id": "BRL", # Real Brasileiro
        }

        # Dados para criar a preferência
        preference_data = {
            "items": [item_data],
            "payer": {
                "email": request.user.email,
                "name": request.user.first_name,
                "surname": request.user.last_name,
            },
            "notification_url": settings.MERCADO_PAGO_WEBHOOK_URL, # URL para o Mercado Pago notificar seu backend
            "external_reference": str(appointment.id), # ID do agendamento no seu sistema
            "back_urls": { # URLs para redirecionamento após o pagamento (frontend)
                "success": f"{settings.CORS_ALLOWED_ORIGINS[0]}/client/dashboard?payment_status=success&appointment_id={appointment.id}",
                "pending": f"{settings.CORS_ALLOWED_ORIGINS[0]}/client/dashboard?payment_status=pending&appointment_id={appointment.id}",
                "failure": f"{settings.CORS_ALLOWED_ORIGINS[0]}/client/dashboard?payment_status=failure&appointment_id={appointment.id}",
            },
            "auto_return": "approved_payments", # Retorna automaticamente para success_url se aprovado
        }

        try:
            preference_response = mp.preference().create(preference_data)
            preference = preference_response["response"]
            
            appointment.mercadopago_preference_id = preference['id']
            appointment.payment_status = 'PENDING'
            appointment.status = 'PENDING_PAYMENT' # Atualiza status do agendamento
            appointment.save()

            return Response({
                "preference_id": preference['id'],
                "init_point": preference['init_point']
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erro ao criar preferência no Mercado Pago: {e}")
            return Response({"detail": "Erro ao criar preferência de pagamento."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny]) # Webhook não precisa de autenticação JWT, mas precisará de validação de assinatura MP
def mercadopago_webhook(request):
    try:
        data = request.data
        topic = request.query_params.get('topic')

        if topic == 'payment':
            payment_id = data.get('id')
            if not payment_id:
                return Response({"detail": "ID de pagamento não fornecido."}, status=status.HTTP_400_BAD_REQUEST)

            # Consulta o status do pagamento no Mercado Pago
            payment_info = mp.payment().get(payment_id)
            if payment_info and payment_info['response']['status_code'] == 200:
                mp_payment = payment_info['response']
                status_mp = mp_payment['status']
                external_reference = mp_payment.get('external_reference')  # Nosso appointment ID

                try:
                    appointment = Appointment.objects.get(id=external_reference)
                except Appointment.DoesNotExist:
                    logger.warning(f"Webhook: Agendamento com external_reference {external_reference} não encontrado.")
                    return Response(status=status.HTTP_200_OK)  # Retorna OK para MP

                # Mapeamento de status do Mercado Pago para o seu sistema
                if status_mp == 'approved':
                    appointment.payment_status = 'PAID'
                    appointment.status = 'CONFIRMED'
                    Notification.objects.create(
                        user=appointment.client,
                        message=f"Seu pagamento para o agendamento de {appointment.service.name} foi aprovado! Seu agendamento está confirmado.",
                        type='PAYMENT_SUCCESS'
                    )
                elif status_mp == 'pending':
                    appointment.payment_status = 'PENDING'
                    appointment.status = 'PENDING_PAYMENT'
                elif status_mp == 'refunded':
                    appointment.payment_status = 'REFUNDED'
                    appointment.status = 'CANCELED'
                elif status_mp == 'cancelled':
                    appointment.payment_status = 'CANCELLED'
                    appointment.status = 'CANCELED'
                elif status_mp == 'rejected':
                    appointment.payment_status = 'REJECTED'
                    appointment.status = 'PENDING_PAYMENT'
                    Notification.objects.create(
                        user=appointment.client,
                        message=f"Seu pagamento para o agendamento de {appointment.service.name} foi rejeitado. Por favor, tente novamente.",
                        type='PAYMENT_FAILURE'
                    )

                appointment.mercadopago_payment_id = payment_id
                appointment.save()

                # Crie ou atualize o log de pagamento
                Payment.objects.update_or_create(
                    mercadopago_id=payment_id,
                    defaults={
                        'appointment': appointment,
                        'status': status_mp,
                        'amount': mp_payment.get('transaction_amount', 0.0),
                        'payment_method': mp_payment.get('payment_type_id'),
                        'response_data': mp_payment,
                    }
                )

                return Response(status=status.HTTP_200_OK)
            else:
                logger.error(f"Erro ao consultar pagamento no Mercado Pago: {payment_info}")
                return Response({"detail": "Erro ao consultar pagamento no Mercado Pago."}, status=status.HTTP_400_BAD_REQUEST)

        # Outros tópicos podem ser tratados aqui
        logger.info(f"Webhook recebido: Tópico={topic}, Dados={data}")
        return Response(status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Erro inesperado no webhook do Mercado Pago: {e}")
        return Response({"detail": "Erro interno no processamento do webhook."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class NotificationViewSet(viewsets.ReadOnlyModelViewSet): # Apenas leitura e marcação como lida
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        if notification.user != request.user:
            return Response({"detail": "Você não tem permissão para acessar esta notificação."}, status=status.HTTP_403_FORBIDDEN)
        
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)
    logger = logging.getLogger(__name__)

class NotificationViewSet(viewsets.ReadOnlyModelViewSet):  # Apenas leitura e marcação como lida
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=True, methods=['post'], url_path='mark-as-read')
    def mark_as_read(self, request, pk=None):
        try:
            notification = self.get_object()
            if notification.user != request.user:
                return Response({"detail": "Você não tem permissão para acessar esta notificação."}, status=status.HTTP_403_FORBIDDEN)

            notification.is_read = True
            notification.save()
            return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Erro ao marcar notificação como lida: {e}")
            return Response({"detail": "Erro ao processar a solicitação."}, status=status.HTTP_400_BAD_REQUEST)