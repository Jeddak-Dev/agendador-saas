import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { logout } from '../auth';

function ClientLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <header>
                <h1>Agendador Online - Cliente</h1>
                <nav>
                    <ul>
                        <li><Link to="/client">Dashboard</Link></li>
                        <li><Link to="/client/appointments">Meus Agendamentos</Link></li>
                        <li><Link to="/client/profile">Meu Perfil</Link></li>
                        <li><button onClick={handleLogout}>Sair</button></li>
                    </ul>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <p>&copy; 2025 Agendador Online. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default ClientLayout;