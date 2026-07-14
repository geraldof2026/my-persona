import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/auth/Login";

function App() {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
}

export default App;