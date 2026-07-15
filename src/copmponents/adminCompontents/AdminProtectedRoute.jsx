import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const { adminToken, isAdminAuthenticated } = useSelector(
    (state) => state.auth,
  );

  if (!adminToken || !isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
