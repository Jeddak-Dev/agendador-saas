import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardClient from './pages/DashboardClient';
import DashboardAdmin from './pages/DashboardAdmin';
// ... outras páginas como Agendamento, Detalhes do Estabelecimento, etc.

// Layouts
import ClientLayout from './layouts/ClientLayout';
import AdminLayout from './layouts/AdminLayout';

// Componentes
import ProtectedRoute from './components/ProtectedRoute'; // Importe seu ProtectedRoute
import { getUserRole } from './auth'; // Importe a função para obter o papel do usuário

function App() {
    const userRole = getUserRole(); // Obtém o papel do usuário do token JWT

    return (
        <Router>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Rotas Protegidas para Clientes */}
                <Route
                    path="/client/*"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <ClientLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardClient />} />
                    {/* Exemplo: Rota para ver agendamentos específicos do cliente */}
                    {/* <Route path="appointments" element={<ClientAppointmentsPage />} /> */}
                    {/* <Route path="profile" element={<ClientProfilePage />} /> */}
                </Route>

                {/* Rotas Protegidas para Admins/Owners */}
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'owner']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardAdmin />} />
                    {/* Exemplo: Rotas para gerenciar serviços, profissionais, etc. */}
                    {/* <Route path="establishments" element={<EstablishmentManagement />} /> */}
                    {/* <Route path="services" element={<ServiceManagement />} /> */}
                    {/* <Route path="professionals" element={<ProfessionalManagement />} /> */}
                    {/* <Route path="appointments" element={<AdminAppointmentsManagement />} /> */}
                    {/* <Route path="reports" element={<ReportsPage />} /> */}
                </Route>

                {/* Redirecionamento baseado no papel do usuário após login */}
                {userRole === 'client' && <Route path="/dashboard" element={<Navigate to="/client" replace />} />}
                {(userRole === 'admin' || userRole === 'owner') && <Route path="/dashboard" element={<Navigate to="/admin" replace />} />}
                
                {/* Rota padrão para 404 - Not Found */}
                <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
            </Routes>
        </Router>
    );
}

export default App;