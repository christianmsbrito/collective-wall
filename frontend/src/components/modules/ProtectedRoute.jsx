import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  // Show a loading screen while checking user data
  if (loading) {
    return <div>Loading...</div>; // Replace with a proper loading spinner if needed
  }

  // Redirect to login if user is not authenticated and loading is complete
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Allow access if user is authenticated
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
