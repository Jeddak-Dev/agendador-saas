from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils import timezone
from django.utils.text import slugify


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('O email deve ser fornecido')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True) # Novo campo
        extra_fields.setdefault('is_owner', True) # Novo campo

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    is_client = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False) # Para admins de um estabelecimento
    is_owner = models.BooleanField(default=False) # Para proprietários de estabelecimentos
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # Mantenha ou remova, dependendo do que for essencial

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

class Establishment(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'is_owner': True}, related_name='establishments')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255, blank=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='establishment_logos/', blank=True, null=True)
    active = models.BooleanField(default=True)
    # Exemplo: working_hours pode ser um JSONField ou um relacionamento com outro modelo
    # working_hours = models.JSONField(default=dict, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            original_slug = self.slug
            counter = 1
            while Establishment.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Estabelecimento"
        verbose_name_plural = "Estabelecimentos"

class Service(models.Model):
    establishment = models.ForeignKey(Establishment, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_minutes = models.IntegerField(help_text="Duração do serviço em minutos")
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.establishment.name})"

    class Meta:
        verbose_name = "Serviço"
        verbose_name_plural = "Serviços"
        unique_together = ('establishment', 'name') # Um serviço tem nome único por estabelecimento

class Professional(models.Model):
    establishment = models.ForeignKey(Establishment, on_delete=models.CASCADE, related_name='professionals')
    name = models.CharField(max_length=255)
    specialty = models.CharField(max_length=100, blank=True, null=True) # Ex: Barbeiro, Cabeleireiro, Esteticista
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to='professional_photos/', blank=True, null=True)
    user_account = models.OneToOneField(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='professional_profile', help_text="Vincule a um usuário existente se o profissional tiver um login dedicado.")
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.establishment.name})"

    class Meta:
        verbose_name = "Profissional"
        verbose_name_plural = "Profissionais"
        unique_together = ('establishment', 'name')

class Availability(models.Model):
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name='availabilities')
    day_of_week = models.IntegerField(choices=[(0, 'Domingo'), (1, 'Segunda'), (2, 'Terça'), (3, 'Quarta'), (4, 'Quinta'), (5, 'Sexta'), (6, 'Sábado')])
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.professional.name} - {self.get_day_of_week_display()}: {self.start_time.strftime('%H:%M')} - {self.end_time.strftime('%H:%M')}"

    class Meta:
        verbose_name = "Disponibilidade"
        verbose_name_plural = "Disponibilidades"
        unique_together = ('professional', 'day_of_week', 'start_time', 'end_time') # Evitar disponibilidades duplicadas

class Holiday(models.Model):
    establishment = models.ForeignKey(Establishment, on_delete=models.CASCADE, related_name='holidays')
    date = models.DateField()
    description = models.CharField(max_length=255, blank=True, null=True)
    is_recurring = models.BooleanField(default=False, help_text="Se for um feriado recorrente anualmente (ex: Natal)")

    def __str__(self):
        return f"{self.establishment.name} - Feriado: {self.date}"

    class Meta:
        verbose_name = "Feriado/Exceção"
        verbose_name_plural = "Feriados/Exceções"
        unique_together = ('establishment', 'date')

class Appointment(models.Model):
    client = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='appointments_as_client')
    professional = models.ForeignKey(Professional, on_delete=models.CASCADE, related_name='appointments_as_professional')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='appointments_for_service')
    establishment = models.ForeignKey(Establishment, on_delete=models.CASCADE, related_name='appointments_in_establishment')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status_choices = [
        ('PENDING_PAYMENT', 'Aguardando Pagamento'), # Novo status
        ('SCHEDULED', 'Agendado'),
        ('CONFIRMED', 'Confirmado'),
        ('COMPLETED', 'Concluído'),
        ('CANCELED', 'Cancelado'),
        ('NO_SHOW', 'Não Compareceu'),
    ]
    status = models.CharField(max_length=50, choices=status_choices, default='SCHEDULED') # Alterado para default Scheduled
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Preço final do agendamento

    # Campos relacionados ao pagamento (Mercado Pago)
    payment_status_choices = [
        ('PENDING', 'Pendente'),
        ('PAID', 'Pago'),
        ('REFUNDED', 'Estornado'),
        ('CANCELLED', 'Cancelado'), # Pode ser diferente do status do agendamento
        ('REJECTED', 'Rejeitado'),
    ]
    payment_status = models.CharField(max_length=50, choices=payment_status_choices, default='PENDING')
    mercadopago_preference_id = models.CharField(max_length=255, blank=True, null=True, help_text="ID da preferência de pagamento no Mercado Pago")
    mercadopago_payment_id = models.CharField(max_length=255, blank=True, null=True, help_text="ID da transação no Mercado Pago")

    def __str__(self):
        return f"Agendamento de {self.client.email} para {self.service.name} com {self.professional.name} em {self.start_time.strftime('%d/%m/%Y %H:%M')}"

    class Meta:
        verbose_name = "Agendamento"
        verbose_name_plural = "Agendamentos"
        ordering = ['start_time']

class Payment(models.Model): # Para logar detalhes de pagamentos, pode ser opcional se Appointment já for suficiente
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='payment_detail')
    mercadopago_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    response_data = models.JSONField(blank=True, null=True) # Para armazenar a resposta completa da API

    def __str__(self):
        return f"Pagamento #{self.mercadopago_id} - {self.status} - R${self.amount}"

    class Meta:
        verbose_name = "Pagamento (Detalhes MP)"
        verbose_name_plural = "Pagamentos (Detalhes MP)"


class Notification(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    type_choices = [
        ('APPOINTMENT_CONFIRMATION', 'Confirmação de Agendamento'),
        ('APPOINTMENT_REMINDER', 'Lembrete de Agendamento'),
        ('APPOINTMENT_CANCELLATION', 'Cancelamento de Agendamento'),
        ('PAYMENT_SUCCESS', 'Pagamento Confirmado'),
        ('PAYMENT_FAILURE', 'Pagamento Recusado'),
        ('GENERAL', 'Geral'),
    ]
    type = models.CharField(max_length=50, choices=type_choices, default='GENERAL')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notificação para {self.user.email} - {self.message[:50]}..."

    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ['-created_at']