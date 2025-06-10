import React, { useState, useEffect } from 'react';
import { api } from '../auth'; // Sua instância do Axios configurada com interceptor
import { toast } from 'react-toastify';

function DashboardClient() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await api.get('/appointments/'); // Busca os agendamentos do cliente logado
                setAppointments(response.data.results); // Supondo que a API retorna paginação
            } catch (err) {
                console.error('Erro ao buscar agendamentos:', err);
                setError('Não foi possível carregar seus agendamentos.');
                toast.error('Erro ao carregar agendamentos.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
            return;
        }
        try {
            await api.post(`/appointments/${appointmentId}/cancel/`);
            setAppointments(appointments.map(app => 
                app.id === appointmentId ? { ...app, status: 'CANCELED' } : app
            ));
            toast.success('Agendamento cancelado com sucesso!');
        } catch (err) {
            console.error('Erro ao cancelar agendamento:', err);
            toast.error(err.response?.data?.detail || 'Erro ao cancelar agendamento.');
        }
    };

    if (loading) return <div style={dashboardStyles.loading}>Carregando dashboard do cliente...</div>;
    if (error) return <div style={dashboardStyles.error}>{error}</div>;

    return (
        <div style={dashboardStyles.container}>
            <h1 style={dashboardStyles.title}>Dashboard do Cliente</h1>
            <p style={dashboardStyles.welcomeText}>Bem-vindo(a) à sua área de cliente. Aqui você pode ver seus agendamentos e gerenciar seu perfil.</p>

            <h2 style={dashboardStyles.subtitle}>Seus Agendamentos Recentes</h2>
            {appointments.length === 0 ? (
                <p style={dashboardStyles.noAppointments}>Você não tem agendamentos recentes. Que tal <Link to="/book-appointment">agendar um agora</Link>?</p>
            ) : (
                <div style={dashboardStyles.appointmentsGrid}>
                    {appointments.map(appointment => (
                        <div key={appointment.id} style={dashboardStyles.appointmentCard}>
                            <h3 style={dashboardStyles.cardTitle}>{appointment.service_name}</h3>
                            <p><strong>Profissional:</strong> {appointment.professional_name}</p>
                            <p><strong>Estabelecimento:</strong> {appointment.establishment_name}</p>
                            <p><strong>Data:</strong> {new Date(appointment.start_time).toLocaleDateString()} às {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p><strong>Status:</strong> <span style={dashboardStyles.statusBadge[appointment.status]}>{appointment.status.replace('_', ' ')}</span></p>
                            <p><strong>Valor:</strong> R${appointment.total_amount}</p>
                            {appointment.status === 'SCHEDULED' || appointment.status === 'PENDING_PAYMENT' ? (
                                <button
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                    style={dashboardStyles.cancelButton}
                                >
                                    Cancelar Agendamento
                                </button>
                            ) : null}
                            {appointment.payment_status === 'PENDING' && appointment.mercadopago_preference_id && (
                                <a 
                                    href={`https://www.mercadopago.com.br/checkout/v1/redirect?preference_id=${appointment.mercadopago_preference_id}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={dashboardStyles.payButton}
                                >
                                    Pagar com Mercado Pago
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const dashboardStyles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
    },
    welcomeText: {
        textAlign: 'center',
        color: '#555',
        marginBottom: '40px',
        fontSize: '1.1em',
    },
    subtitle: {
        color: '#333',
        marginBottom: '20px',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
    },
    appointmentsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    appointmentCard: {
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    },
    cardTitle: {
        color: '#007bff',
        marginTop: 0,
        marginBottom: '10px',
    },
    statusBadge: {
        SCHEDULED: { backgroundColor: '#ffc107', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        CONFIRMED: { backgroundColor: '#28a745', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        COMPLETED: { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        CANCELED: { backgroundColor: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        NO_SHOW: { backgroundColor: '#6f42c1', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        PENDING_PAYMENT: { backgroundColor: '#17a2b8', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        PAID: { backgroundColor: '#28a745', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        PENDING: { backgroundColor: '#ffc107', color: '#333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        REFUNDED: { backgroundColor: '#6c757d', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        CANCELLED: { backgroundColor: '#dc3545', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
        REJECTED: { backgroundColor: '#fd7e14', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' },
    },
    cancelButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '15px',
        width: '100%',
        '&:hover': {
            backgroundColor: '#c82333',
        },
    },
    payButton: {
        display: 'block',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px',
        width: '100%',
        textAlign: 'center',
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
    loading: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2em',
        color: '#666',
    },
    error: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '1.2em',
        color: '#dc3545',
    },
    noAppointments: {
        textAlign: 'center',
        fontSize: '1.1em',
        color: '#777',
        marginTop: '30px',
    }
};


export default DashboardClient;