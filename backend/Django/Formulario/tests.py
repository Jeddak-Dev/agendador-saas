from django.test import TestCase, Client
from django.urls import reverse

class ViewTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_inicio_view(self):
        response = self.client.get(reverse('inicio'))  # Usa o name dado na URL
        self.assertEqual(response.status_code, 200)

    def test_painel_admin_view(self):
        response = self.client.get(reverse('painel_admin'))
        self.assertEqual(response.status_code, 200)
