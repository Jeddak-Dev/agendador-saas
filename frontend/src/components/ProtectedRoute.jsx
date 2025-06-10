import { Navigate } from "react-router-dom";
import { auth } from "../auth";

const ProtectedRoute = ({ children, role }) => {
  const user = auth.getUser();

  if (!auth.isAuthenticated()) return <Navigate to="/login" />;

  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;