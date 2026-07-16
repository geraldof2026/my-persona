import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Importe o seu Provider
import './index.css'; // O seu CSS do Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- O AuthProvider tem que abraçar o App */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);