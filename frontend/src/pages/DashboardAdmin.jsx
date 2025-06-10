import React, { useState, useEffect } from 'react';
import { api, getUserRole } from '../auth'; // Sua instância do Axios
import { toast } from 'react-toastify';

function DashboardAdmin() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = getUserRole(); // 'admin' ou 'owner'

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Admins/Owners podem ver todos os agendamentos gerenciados por eles
                const response = await api.get('/appointments/'); 
                setAppointments(response.data.results);
            } catch (err) {
                console.error('Erro ao buscar agendamentos:', err);
                setError('Não foi possível carregar os agendamentos.');
                toast.error('Erro ao carregar agendamentos.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const handleChangeStatus = async (appointmentId, newStatus) => {
        if (!window.confirm(`Tem certeza que deseja mudar o status para ${newStatus}?`)) {
            return;
        }
        try {
            const response = await api.patch(`/appointments/${appointmentId}/`, { status: newStatus });
            setAppointments(appointments.map(app => 
                app.id === appointmentId ? response.data : app
            ));
            toast.success(`Status do agendamento atualizado para ${newStatus}!`);
        } catch (err) {
            console.error('Erro ao atualizar status:', err);
            toast.error(err.response?.data?.detail || 'Erro ao atualizar status do agendamento.');
        }
    };

    if (loading) return <div style={dashboardStyles.loading}>Carregando dashboard...</div>;
    if (error) return <div style={dashboardStyles.error}>{error}</div>;

    return (
        <div style={dashboardStyles.container}>
            <h1 style={dashboardStyles.title}>Dashboard de {userRole === 'owner' ? 'Proprietário' : 'Administrador'}</h1>
            <p style={dashboardStyles.welcomeText}>Visão geral dos agendamentos e atividades do seu estabelecimento.</p>

            <h2 style={dashboardStyles.subtitle}>Agendamentos Recentes</h2>
            {appointments.length === 0 ? (
                <p style={dashboardStyles.noData}>Nenhum agendamento encontrado.</p>
            ) : (
                <div style={dashboardStyles.appointmentsGrid}>
                    {appointments.map(appointment => (
                        <div key={appointment.id} style={dashboardStyles.appointmentCard}>
                            <h3 style={dashboardStyles.cardTitle}>{appointment.service_name}</h3>
                            <p><strong>Cliente:</strong> {appointment.client_email}</p>
                            <p><strong>Profissional:</strong> {appointment.professional_name}</p>
                            <p><strong>Estabelecimento:</strong> {appointment.establishment_name}</p>
                            <p><strong>Data/Hora:</strong> {new Date(appointment.start_time).toLocaleString()}</p>
                            <p><strong>Status Agendamento:</strong> <span style={dashboardStyles.statusBadge[appointment.status]}>{appointment.status.replace('_', ' ')}</span></p>
                            <p><strong>Status Pagamento:</strong> <span style={dashboardStyles.statusBadge[appointment.payment_status]}>{appointment.payment_status.replace('_', ' ')}</span></p>
                            <p><strong>Valor:</strong> R${appointment.total_amount}</p>
                            
                            <div style={dashboardStyles.actions}>
                                <select 
                                    value={appointment.status} 
                                    onChange={(e) => handleChangeStatus(appointment.id, e.target.value)}
                                    style={dashboardStyles.statusSelect}
                                >
                                    <option value="SCHEDULED">Agendado</option>
                                    <option value="CONFIRMED">Confirmado</option>
                                    <option value="COMPLETED">Concluído</option>
                                    <option value="CANCELED">Cancelado</option>
                                    <option value="NO_SHOW">Não Compareceu</option>
                                    <option value="PENDING_PAYMENT">Aguardando Pagamento</option>
                                </select>
                                {/* Botões para outras ações como ver detalhes, editar, etc. */}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Futuros gráficos e relatórios podem ir aqui */}
            <h2 style={dashboardStyles.subtitle}>Relatórios Rápidos</h2>
            <div style={dashboardStyles.reportsContainer}>
                <div style={dashboardStyles.reportCard}>
                    <h3>Agendamentos Confirmados (Mês)</h3>
                    <p>50</p>
                </div>
                <div style={dashboardStyles.reportCard}>
                    <h3>Faturamento Estimado (Mês)</h3>
                    <p>R$ 5.000,00</p>
                </div>
                {/* Adicione mais cards de relatório conforme necessário */}
            </div>
        </div>
    );
}

const dashboardStyles = {
    container: {
        padding: '20px',
        maxWidth: '1400px',
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
        marginTop: '30px',
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
        color: '#28a745',
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
    actions: {
        marginTop: '15px',
        display: 'flex',
        gap: '10px',
    },
    statusSelect: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
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
    noData: {
        textAlign: 'center',
        fontSize: '1.1em',
        color: '#777',
        marginTop: '30px',
    },
    reportsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px',
    },
    reportCard: {
        backgroundColor: '#e9ecef',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
    }
};

export default DashboardAdmin;