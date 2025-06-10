import { Outlet, Link } from "react-router-dom";
import { auth } from "../auth";

export default function AdminLayout() {
  return (
    <div>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <button onClick={() => { auth.logout(); window.location.href = "/login"; }}>Sair</button>
      </nav>
      <Outlet />
    </div>
  );
}