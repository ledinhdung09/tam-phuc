import { Navigate } from "react-router-dom";
import { useAuth } from "../page/Auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/dang-nhap" />;
};

export default ProtectedRoute;
