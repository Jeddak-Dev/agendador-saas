import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth'; // Importe a função de logout

function ClientLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={layoutStyles.container}>
            <header style={layoutStyles.header}>
                <h1 style={layoutStyles.title}>Agendador Online - Cliente</h1>
                <nav>
                    <ul style={layoutStyles.navList}>
                        <li style={layoutStyles.navItem}><Link to="/client" style={layoutStyles.navLink}>Dashboard</Link></li>
                        <li style={layoutStyles.navItem}><Link to="/client/appointments" style={layoutStyles.navLink}>Meus Agendamentos</Link></li>
                        <li style={layoutStyles.navItem}><Link to="/client/profile" style={layoutStyles.navLink}>Meu Perfil</Link></li>
                        <li style={layoutStyles.navItem}><button onClick={handleLogout} style={layoutStyles.logoutButton}>Sair</button></li>
                    </ul>
                </nav>
            </header>
            <main style={layoutStyles.mainContent}>
                <Outlet /> {/* Renderiza o conteúdo da rota filha aqui */}
            </main>
            <footer style={layoutStyles.footer}>
                <p>&copy; 2025 Agendador Online. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

const layoutStyles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    header: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
        margin: 0,
        fontSize: '24px',
    },
    navList: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
    },
    navItem: {
        marginLeft: '20px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        '&:hover': {
            textDecoration: 'underline',
        },
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        '&:hover': {
            backgroundColor: '#c82333',
        },
    },
    mainContent: {
        flex: 1,
        padding: '20px',
    },
    footer: {
        backgroundColor: '#343a40',
        color: '#fff',
        textAlign: 'center',
        padding: '15px 0',
        fontSize: '14px',
    },
};

export default ClientLayout;