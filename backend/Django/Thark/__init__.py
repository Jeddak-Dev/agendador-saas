# core.py (ou utils.py)
from django.conf import settings
from django.urls import get_resolver
from django.core.asgi import get_asgi_application
from django.core.wsgi import get_wsgi_application

def get_settings():
    return settings

def get_urls():
    return get_resolver().url_patterns

def get_asgi():
    return get_asgi_application()

def get_wsgi():
    return get_wsgi_application()
