from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse

# Página inicial com formulário de login
def inicio(request: HttpRequest) -> HttpResponse:
    return render(request, 'index.html')  # Certifique-se de que esse template exista

# Página de painel administrativo
def painel_admin(request: HttpRequest) -> HttpResponse:
    return render(request, 'Admin.html')  # Certifique-se de que esse template exista
