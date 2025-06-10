import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, getUserRole } from '../auth';

const ProtectedRoute = ({ allowedRoles }) => {
    const isAuthenticated = !!getAccessToken();
    const userRole = getUserRole();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        if (userRole === 'client') {
            return <Navigate to="/client" replace />;
        } else if (userRole === 'admin' || userRole === 'owner') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;