import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={homeStyles.container}>
            {/* Seção de Cabeçalho com Imagem de Fundo */}
            <header style={homeStyles.header}>
                <div style={homeStyles.overlay}>
                    <h1 style={homeStyles.title}>The Gent's Cut</h1>
                    <p style={homeStyles.tagline}>Estilo, Tradição e Excelência em Cada Corte.</p>
                    <div style={homeStyles.authButtons}>
                        <Link to="/login" style={homeStyles.loginButton}>Entrar</Link>
                        <Link to="/register" style={homeStyles.registerButton}>Criar Conta</Link>
                    </div>
                </div>
            </header>

            {/* Seção Sobre Nós */}
            <section style={homeStyles.aboutSection}>
                <h2 style={homeStyles.sectionTitle}>Nossa Barbearia</h2>
                <div style={homeStyles.aboutContent}>
                    <img
                        src="https://images.unsplash.com/photo-1594957657962-e9a93011400e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Barbearia interior"
                        style={homeStyles.aboutImage}
                    />
                    <p style={homeStyles.aboutText}>
                        No The Gent's Cut, cultivamos a arte clássica da barbearia. Oferecemos cortes de cabelo impecáveis, barbas perfeitamente aparadas e uma experiência relaxante em um ambiente acolhedor. Nossos profissionais experientes estão prontos para cuidar do seu estilo com precisão e paixão.
                    </p>
                </div>
            </section>

            {/* Seção de Serviços */}
            <section style={homeStyles.servicesSection}>
                <h2 style={homeStyles.sectionTitle}>Nossos Serviços</h2>
                <div style={homeStyles.serviceGrid}>
                    <div style={homeStyles.serviceCard}>
                        <img src="https://images.unsplash.com/photo-1596765743224-b1f4868725ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Corte de Cabelo" style={homeStyles.serviceImage} />
                        <h3>Corte Masculino</h3>
                        <p>Cortes clássicos e modernos, adaptados ao seu estilo.</p>
                    </div>
                    <div style={homeStyles.serviceCard}>
                        <img src="https://images.unsplash.com/photo-1596765743224-b1f4868725ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Barba" style={homeStyles.serviceImage} />
                        <h3>Design de Barba</h3>
                        <p>Aparar, modelar e hidratar para uma barba perfeita.</p>
                    </div>
                    <div style={homeStyles.serviceCard}>
                        <img src="https://images.unsplash.com/photo-1596765743224-b1f4868725ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tratamentos Faciais" style={homeStyles.serviceImage} />
                        <h3>Tratamentos Faciais</h3>
                        <p>Revitalize sua pele com nossos tratamentos especiais.</p>
                    </div>
                </div>
                <Link to="/agendamento" style={homeStyles.callToAction}>Agende Agora!</Link>
            </section>

            {/* Seção de Depoimentos (Opcional, mas profissionaliza) */}
            <section style={homeStyles.testimonialsSection}>
                <h2 style={homeStyles.sectionTitle}>O que Nossos Clientes Dizem</h2>
                <div style={homeStyles.testimonialGrid}>
                    <div style={homeStyles.testimonialCard}>
                        <p style={homeStyles.testimonialText}>"Melhor barbearia da cidade! Atendimento impecável e corte de qualidade."</p>
                        <p style={homeStyles.testimonialAuthor}>- João Silva</p>
                    </div>
                    <div style={homeStyles.testimonialCard}>
                        <p style={homeStyles.testimonialText}>"Ambiente acolhedor e profissionais super talentosos. Recomendo!"</p>
                        <p style={homeStyles.testimonialAuthor}>- Pedro Santos</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={homeStyles.footer}>
                <p>&copy; 2025 The Gent's Cut. Todos os direitos reservados.</p>
                <div style={homeStyles.socialLinks}>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={homeStyles.socialIcon}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_icon_%282019%29.svg" alt="Facebook" style={{ width: '24px', height: '24px' }} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={homeStyles.socialIcon}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" style={{ width: '24px', height: '24px' }} />
                    </a>
                    {/* Adicione outros ícones de redes sociais conforme necessário */}
                </div>
            </footer>
        </div>
    );
}

// Estilos para a página Home
const homeStyles = {
    container: {
        fontFamily: "'Playfair Display', serif", // Fonte mais elegante e clássica
        textAlign: 'center',
        backgroundColor: '#1a1a1a', // Fundo escuro para um toque mais sofisticado
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: '#f0f0f0', // Texto claro para contraste
    },
    header: {
        position: 'relative',
        height: '600px', // Altura maior para a imagem de fundo
        backgroundImage: 'url("https://images.unsplash.com/photo-1502014822147-ba0e309f060c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Escurece a imagem para melhor leitura do texto
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '4.5em',
        marginBottom: '15px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '5px',
        fontFamily: "'Cinzel Decorative', cursive", // Fonte decorativa para o título
    },
    tagline: {
        fontSize: '1.8em',
        marginBottom: '40px',
        fontStyle: 'italic',
        fontFamily: "'Merriweather', serif", // Fonte serifada para a tagline
    },
    authButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '25px',
    },
    loginButton: {
        backgroundColor: '#b8860b', // Dourado/Bronze
        color: '#fff',
        padding: '15px 35px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.2em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        '&:hover': {
            backgroundColor: '#a07800',
            transform: 'scale(1.05)',
        },
    },
    registerButton: {
        backgroundColor: '#4a4a4a', // Cinza escuro
        color: '#fff',
        padding: '15px 35px',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.2em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        '&:hover': {
            backgroundColor: '#333333',
            transform: 'scale(1.05)',
        },
    },
    sectionTitle: {
        fontSize: '3em',
        color: '#f0f0f0',
        marginBottom: '50px',
        textTransform: 'uppercase',
        letterSpacing: '3px',
        position: 'relative',
        paddingBottom: '10px',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '4px',
            backgroundColor: '#b8860b',
            borderRadius: '2px',
        },
    },
    aboutSection: {
        padding: '80px 20px',
        backgroundColor: '#282828', // Fundo um pouco mais claro que o container
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    aboutContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '900px',
        margin: '0 auto',
    },
    aboutImage: {
        width: '100%',
        maxWidth: '500px',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
    },
    aboutText: {
        fontSize: '1.1em',
        lineHeight: '1.8',
        color: '#cccccc',
        maxWidth: '800px',
    },
    servicesSection: {
        padding: '80px 20px',
        backgroundColor: '#1a1a1a',
    },
    serviceGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '40px',
        maxWidth: '1200px',
        margin: '0 auto 60px',
    },
    serviceCard: {
        backgroundColor: '#282828',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    serviceImage: {
        width: '100%',
        maxWidth: '250px',
        height: '180px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '20px',
    },
    callToAction: {
        backgroundColor: '#b8860b',
        color: '#fff',
        padding: '18px 40px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontSize: '1.5em',
        fontWeight: 'bold',
        display: 'inline-block',
        marginTop: '30px',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        '&:hover': {
            backgroundColor: '#a07800',
            transform: 'scale(1.05)',
        },
    },
    testimonialsSection: {
        padding: '80px 20px',
        backgroundColor: '#282828',
    },
    testimonialGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    testimonialCard: {
        backgroundColor: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        borderLeft: '5px solid #b8860b',
        textAlign: 'left',
    },
    testimonialText: {
        fontSize: '1.1em',
        fontStyle: 'italic',
        lineHeight: '1.6',
        marginBottom: '15px',
        color: '#e0e0e0',
    },
    testimonialAuthor: {
        fontWeight: 'bold',
        color: '#f0f0f0',
        fontSize: '1em',
    },
    footer: {
        backgroundColor: '#000', // Preto puro para o footer
        color: '#888',
        padding: '30px 20px',
        marginTop: 'auto',
        fontSize: '0.9em',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialLinks: {
        marginTop: '20px',
        display: 'flex',
        gap: '15px',
    },
    socialIcon: {
        color: '#888',
        fontSize: '1.5em',
        transition: 'color 0.3s ease',
        '&:hover': {
            color: '#b8860b',
        },
    },
};

export default Home;