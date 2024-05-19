import React from "react";
import Chat from "./modules/Chat";

const App = () => {
  const props = JSON.parse(document.getElementById("app-props").innerHTML);
  return <Chat props={props} />;
};

export default App;
