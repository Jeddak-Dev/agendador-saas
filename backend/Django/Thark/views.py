from django.shortcuts import render, redirect
from django.http import HttpResponse
from Formulario.forms import Formulario, Admin


def inicio(request):
    context = {
        "form": Formulario
    }
    return render(request, 'html/Inicio.html', context)

def admin(request):
    context = {
        "adm": Admin
    }
    return render(request, 'html/Admin.html', context)