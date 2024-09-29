import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getUserData } from "../../../api/user";

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// UserProvider component to wrap the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  // Check for user data in localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Set loading to false after user is checked
  }, []);

  // Function to log out the user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleLogin = async () => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      const tokenValue = token.split("=")[1];
      console.log("tokenValue", tokenValue);
      try {
        const { data } = await getUserData(tokenValue);
        console.log("data", data);
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, handleLogin, loading }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
