import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAppSelector((state) => state.auth);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
