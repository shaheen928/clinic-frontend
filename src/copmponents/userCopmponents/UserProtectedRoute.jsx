import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const { userToken, isUserAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userToken && !isUserAuthenticated) {
    return (
      <Navigate to="/user-login" state={{ from: location.pathname }} replace />
    );
  }

  return children;
};

export default UserProtectedRoute;
