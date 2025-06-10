import { Outlet, Link } from "react-router-dom";
import { auth } from "../auth";

export default function ClientLayout() {
  return (
    <div>
      <nav>
        <Link to="/client/dashboard">Dashboard</Link>
        <button onClick={() => { auth.logout(); window.location.href = "/login"; }}>Sair</button>
      </nav>
      <Outlet />
    </div>
  );
}