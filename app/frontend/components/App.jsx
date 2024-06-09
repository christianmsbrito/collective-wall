import React from "react";
import Chat from "./modules/Chat";
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import Walls from "./modules/Walls";


const App = () => {
  const props = JSON.parse(document.getElementById("app-props").innerHTML);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat props={props} />} />
        <Route path="/walls" element={<Walls props={props} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
