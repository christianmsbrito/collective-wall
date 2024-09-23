import React from "react";
import Chat from "./modules/Chat";
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Walls from "./modules/Walls";
import LoginForm from "./modules/Login";
import RegisterForm from "./modules/Register";
import { UserProvider } from "./modules/contexts/UserContext";

const App = () => {
  const props = JSON.parse(document.getElementById("app-props").innerHTML);
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Chat props={props} />} />
          <Route path="/walls" element={<Walls props={props} />} />
          <Route path="/walls/:id" element={<Chat props={props} />} />
          <Route path="/register" element={<RegisterForm props={props} />} />
          <Route path="/login" element={<LoginForm props={props} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
