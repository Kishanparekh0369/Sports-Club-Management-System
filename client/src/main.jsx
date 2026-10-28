import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Bootstrap JS Bundle
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Global & Page Styles
import './assets/styles/variables.css';
import './assets/styles/global.css';
import './assets/styles/components.css';
import './assets/styles/public.css';
import './assets/styles/auth.css';
import './assets/styles/admin.css';
import './assets/styles/member.css';
import './assets/styles/responsive.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
