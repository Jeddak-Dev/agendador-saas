from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Permissão para permitir acesso apenas a proprietários (is_owner=True).
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_owner

    def has_object_permission(self, request, view, obj):
        # Para objetos de Establishment, o proprietário deve ser o owner do objeto
        if isinstance(obj, type(request.user)): # Se for um CustomUser
            return obj == request.user or request.user.is_owner
        elif hasattr(obj, 'owner'): # Se o objeto tem um campo 'owner' (ex: Establishment)
            return obj.owner == request.user
        return False

class IsEstablishmentAdmin(permissions.BasePermission):
    """
    Permissão para permitir acesso apenas a administradores de um estabelecimento.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin

    def has_object_permission(self, request, view, obj):
        # Verifica se o admin pertence ao estabelecimento do objeto
        if hasattr(request.user, 'professional_profile') and request.user.professional_profile.establishment:
            admin_establishment = request.user.professional_profile.establishment
            if hasattr(obj, 'establishment'):
                return obj.establishment == admin_establishment
            elif isinstance(obj, type(request.user)): # Se for um CustomUser, ele é o próprio admin
                return obj == request.user or (hasattr(obj, 'professional_profile') and obj.professional_profile.establishment == admin_establishment)
        return False

class IsClient(permissions.BasePermission):
    """
    Permissão para permitir acesso apenas a clientes (is_client=True).
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_client

    def has_object_permission(self, request, view, obj):
        # Permite que o cliente acesse seus próprios agendamentos
        if isinstance(obj, type(request.user)): # Se for um CustomUser
            return obj == request.user
        elif hasattr(obj, 'client'): # Se o objeto tem um campo 'client' (ex: Appointment)
            return obj.client == request.user
        return False

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permissão para permitir acesso a proprietários ou administradores de estabelecimento.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_owner or request.user.is_admin)

    def has_object_permission(self, request, view, obj):
        # Proprietário sempre tem acesso
        if request.user.is_owner:
            return True
        # Administrador tem acesso se o objeto pertence ao seu estabelecimento
        if request.user.is_admin and hasattr(request.user, 'professional_profile') and request.user.professional_profile.establishment:
            admin_establishment = request.user.professional_profile.establishment
            if hasattr(obj, 'establishment'):
                return obj.establishment == admin_establishment
            elif isinstance(obj, type(request.user)): # Se for o próprio user admin
                return obj == request.user
        return False


class IsOwnerOrAdminReadOnly(permissions.BasePermission):
    """
    Permissão para permitir que proprietários e administradores editem,
    e outros usuários autenticados (clientes) apenas leiam.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS: # GET, HEAD, OPTIONS
            return request.user.is_authenticated # Todos autenticados podem ler
        return request.user.is_authenticated and (request.user.is_owner or request.user.is_admin)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True # Todos autenticados podem ler o objeto
        
        if request.user.is_owner:
            return True
        if request.user.is_admin and hasattr(request.user, 'professional_profile') and request.user.professional_profile.establishment:
            admin_establishment = request.user.professional_profile.establishment
            if hasattr(obj, 'establishment'):
                return obj.establishment == admin_establishment
            return False
        return False