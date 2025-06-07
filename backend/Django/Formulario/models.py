from django.db import models
from django.core.validators import RegexValidator

Validar_CPF = RegexValidator(
    regex=r'^\d{11}$',
    message='Este campo deve conter apenas números.',
    code='apenas_numeros'
)

class Modelo(models.Model):
    nome = models.CharField(max_length=50)
    CPF = models.CharField(
        max_length=11,
        validators = [Validar_CPF]
    )
    senha = models.CharField(max_length=30)

    def __str__(self):
        return self.nome

class admin(models.Model):
    nome = models.CharField(max_length=50)
    senha = models.CharField(max_length=30)

    def __str__(self):
        return self.nome