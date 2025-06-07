from django import forms
from .models import Modelo, admin

class Formulario(forms.ModelForm):
    senha = forms.CharField(widget=forms.PasswordInput)
    class Meta:
        model = Modelo
        fields = ['nome', 'CPF', 'senha']

class Admin(forms.ModelForm):
    senha = forms.CharField(widget=forms.PasswordInput)
    class Meta:
        model = admin
        fields = ['nome', 'senha']