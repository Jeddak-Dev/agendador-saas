import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, getUserRole } from '../auth';

const ProtectedRoute = ({ allowedRoles }) => {
    const isAuthenticated = !!getAccessToken();
    const userRole = getUserRole();

    if (!isAuthenticated) {
        // Se não estiver autenticado, redireciona para a página de login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Se o usuário não tiver a role permitida, redireciona para o dashboard apropriado ou home
        if (userRole === 'client') {
            return <Navigate to="/client" replace />;
        } else if (userRole === 'admin' || userRole === 'owner') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />; // Fallback
    }

    return <Outlet />; // Renderiza as rotas filhas
};

export default ProtectedRoute;