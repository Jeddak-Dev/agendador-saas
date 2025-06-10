import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={homeStyles.container}>
            <header style={homeStyles.header}>
                <h1 style={homeStyles.title}>Agendador Online Customizável</h1>
                <p style={homeStyles.tagline}>Agende seus serviços de barbearia ou estética com facilidade.</p>
                <div style={homeStyles.authButtons}>
                    <Link to="/login" style={homeStyles.loginButton}>Login</Link>
                    <Link to="/register" style={homeStyles.registerButton}>Cadastro</Link>
                </div>
            </header>
            <section style={homeStyles.featuresSection}>
                <h2 style={homeStyles.sectionTitle}>Recursos Principais</h2>
                <div style={homeStyles.featureGrid}>
                    <div style={homeStyles.featureCard}>
                        <h3>Agendamento Fácil</h3>
                        <p>Encontre e reserve horários disponíveis em poucos cliques.</p>
                    </div>
                    <div style={homeStyles.featureCard}>
                        <h3>Gerenciamento Completo</h3>
                        <p>Para proprietários: gerencie serviços, profissionais e agendamentos.</p>
                    </div>
                    <div style={homeStyles.featureCard}>
                        <h3>Pagamento Seguro</h3>
                        <p>Integração com Mercado Pago para transações rápidas e seguras.</p>
                    </div>
                    <div style={homeStyles.featureCard}>
                        <h3>Customizável</h3>
                        <p>Adapte a plataforma para a identidade visual da sua barbearia ou clínica.</p>
                    </div>
                </div>
            </section>
            <footer style={homeStyles.footer}>
                <p>&copy; 2025 Agendador Online. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

const homeStyles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: '#fff',
        padding: '50px 20px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
    },
    title: {
        fontSize: '3em',
        color: '#343a40',
        marginBottom: '10px',
    },
    tagline: {
        fontSize: '1.2em',
        color: '#6c757d',
        marginBottom: '30px',
    },
    authButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    loginButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '12px 25px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
    },
    registerButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '12px 25px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        '&:hover': {
            backgroundColor: '#218838',
        },
    },
    featuresSection: {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    sectionTitle: {
        fontSize: '2.5em',
        color: '#343a40',
        marginBottom: '40px',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
    },
    featureCard: {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
        },
    },
    footer: {
        backgroundColor: '#343a40',
        color: '#fff',
        padding: '20px 0',
        marginTop: 'auto', // Faz o footer ir para o final da página
    },
};

export default Home;