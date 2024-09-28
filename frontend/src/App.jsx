import React from "react";
import Chat from "./components/modules/Chat";
import {
  Route,
  Routes,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
// import Walls from "./components/modules/Walls";
import LoginForm from "./components/modules/Login";
import RegisterForm from "./components/modules/Register";
import { UserProvider } from "./components/modules/contexts/UserContext";
// import ProtectedRoute from "./components/modules/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route
            path="/"
            element={
              // <ProtectedRoute>
                <Chat />
              // </ProtectedRoute> 
            }
          />
          {/* <Route
            path="/walls"
            element={
              // <ProtectedRoute>
                <Walls />
              // </ProtectedRoute>
            }
          /> */}
          <Route
            path="/walls/:id"
            element={
              // <ProtectedRoute>
                <Chat />
              // </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
