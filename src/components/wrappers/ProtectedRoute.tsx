import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { signOut } from "../../store/reducers/authSlice";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  const { token } = useAppSelector((state) => state.auth);

  // console.log(tosken);

  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
