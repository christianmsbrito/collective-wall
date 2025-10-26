import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  console.log({ user });

  // If the user is not logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user is logged in, allow access to the requested page
  return children;
};

export default ProtectedRoute;
