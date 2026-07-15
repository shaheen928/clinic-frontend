import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const StaffProtectedRoute = ({ children }) => {
  const { staffToken, isStaffAuthenticated } = useSelector(
    (state) => state.auth,
  );
  const location = useLocation();

  if (!staffToken && !isStaffAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default StaffProtectedRoute;
