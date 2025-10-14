import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";

interface ProtectedRouteStaffProps {
  allowedRoles?: ("STAFF" | "ADMIN")[];
}

const ProtectedRouteStaff = ({
  allowedRoles = ["STAFF", "ADMIN"],
}: ProtectedRouteStaffProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/staff-login" replace />;
  }

  if (!user || !allowedRoles.includes(user.role as "STAFF" | "ADMIN")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRouteStaff;
