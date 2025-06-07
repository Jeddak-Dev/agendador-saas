from django.contrib import admin
from django.urls import path
from Formulario import views  # Corrigido caminho do app

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.inicio, name='inicio'),  # nome opcional
    path('proprietario/', views.painel_admin, name='painel_admin')  # Renomeada para evitar conflito
]
