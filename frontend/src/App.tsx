import React from "react";
import { Outlet } from "react-router-dom";
import { AppProvider } from "./app/shared/contexts/AppContext";

function App() {
  return (
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export default App;
