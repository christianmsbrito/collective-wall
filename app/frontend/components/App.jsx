import React from "react";
import Chat from "./modules/Chat";
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';


const App = () => {
  const props = JSON.parse(document.getElementById("app-props").innerHTML);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chat props={props} />} />
      </Routes>
    </Router>
  );
};

export default App;
