import React from "react";
import { Outlet } from "react-router-dom";
import { AppProvider } from "../src/app/shared/contexts/AppContext";

function App() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export default App;
