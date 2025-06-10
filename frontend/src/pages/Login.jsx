import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    auth.login({ name: "Usuário", role });
    navigate(role === "admin" ? "/admin/dashboard" : "/client/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={() => handleLogin("client")}>Entrar como Cliente</button>
      <button onClick={() => handleLogin("admin")}>Entrar como Admin</button>
    </div>
  );
}