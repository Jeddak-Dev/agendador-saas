import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardClient from './pages/DashboardClient';
import DashboardAdmin from './pages/DashboardAdmin';
import SchedulingPage from './pages/SchedulingPage'; // <-- Importa a nova página

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';
import { getUserRole } from './auth';

function App() {
    const userRole = getUserRole();

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} />
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/agendamento" element={<SchedulingPage />} /> {/* <-- Nova Rota Adicionada */}

                {/* Rotas protegidas para clientes */}
                <Route
                    path="/client/*"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardClient />} />
                    {/* Outras rotas aninhadas do cliente podem ser adicionadas aqui. Ex:
                    <Route path="meus-agendamentos" element={<ClientAppointments />} />
                    */}
                </Route>

                {/* Rotas protegidas para admin/owner */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardAdmin />} />
                     {/* Outras rotas aninhadas do admin podem ser adicionadas aqui. Ex:
                    <Route path="gerenciar-horarios" element={<ManageSchedules />} />
                    */}
                </Route>

                {/* Redirecionamento pós-login */}
                {userRole === 'client' && <Route path="/dashboard" element={<Navigate to="/client" replace />} />}
                {(userRole === 'admin' || userRole === 'owner') && <Route path="/dashboard" element={<Navigate to="/admin" replace />} />}

                {/* 404 */}
                <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
            </Routes>
        </>
    );
}

export default App;
