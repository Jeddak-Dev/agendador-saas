from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, CustomUserViewSet, EstablishmentViewSet, ServiceViewSet,
    ProfessionalViewSet, AppointmentViewSet, AvailabilityViewSet, HolidayViewSet,
    PaymentViewSet, mercadopago_webhook, NotificationViewSet
)

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'users', CustomUserViewSet)
router.register(r'establishments', EstablishmentViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'professionals', ProfessionalViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'holidays', HolidayViewSet)
router.register(r'payments', PaymentViewSet)
router.register(r'notifications', NotificationViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('payments/webhook/', mercadopago_webhook, name='mercadopago_webhook'),
]