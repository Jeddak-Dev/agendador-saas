from rest_framework import serializers
from .models import CustomUser, Establishment, Service, Professional, Appointment, Availability, Holiday, Payment
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'phone_number', 'is_client', 'is_admin', 'is_owner', 'profile_picture', 'first_name', 'last_name')
        read_only_fields = ('is_admin', 'is_owner') # Apenas admins/owners podem alterar esses campos

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'is_client', 'first_name', 'last_name', 'phone_number')
        extra_kwargs = {'is_client': {'default': True, 'write_only': True}} # Default para clientes

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "As senhas não coincidem."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            is_client=validated_data.get('is_client', True),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
        )
        return user

class EstablishmentSerializer(serializers.ModelSerializer):
    #owner = CustomUserSerializer(read_only=True) # Pode ser útil para exibição
    owner_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(is_owner=True), source='owner', write_only=True)

    class Meta:
        model = Establishment
        fields = '__all__'
        read_only_fields = ('slug',)

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class ProfessionalSerializer(serializers.ModelSerializer):
    user_account = CustomUserSerializer(read_only=True) # Detalhes do usuário se houver
    user_account_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), source='user_account', write_only=True, allow_null=True, required=False)

    class Meta:
        model = Professional
        fields = '__all__'

class AvailabilitySerializer(serializers.ModelSerializer):
    professional_name = serializers.CharField(source='professional.name', read_only=True)

    class Meta:
        model = Availability
        fields = '__all__'

class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    client_email = serializers.CharField(source='client.email', read_only=True)
    professional_name = serializers.CharField(source='professional.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    establishment_name = serializers.CharField(source='establishment.name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('end_time', 'created_at', 'updated_at', 'total_amount', 'payment_status', 'mercadopago_preference_id', 'mercadopago_payment_id')

    def create(self, validated_data):
        service = validated_data['service']
        validated_data['end_time'] = validated_data['start_time'] + timezone.timedelta(minutes=service.duration_minutes)
        validated_data['total_amount'] = service.price
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Lógica para recalcular end_time se o serviço ou start_time mudar
        if 'service' in validated_data or 'start_time' in validated_data:
            service = validated_data.get('service', instance.service)
            start_time = validated_data.get('start_time', instance.start_time)
            instance.end_time = start_time + timezone.timedelta(minutes=service.duration_minutes)
            instance.total_amount = service.price # Atualiza o valor se o serviço mudar

        return super().update(instance, validated_data)


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('created_at',)

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ('created_at',)