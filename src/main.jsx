import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { supabase } from './lib/supabase';
import './index.css';

// Mounts the React app
function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}

// Stash a password-recovery flag before Supabase parses/clears the URL hash
if (window.location.hash.includes("type=recovery")) {
  sessionStorage.setItem("asn_pending_password_recovery", "1");
}

// Wait for Supabase to process the auth hash before mounting (avoids a HashRouter race)
supabase.auth.getSession().finally(renderApp);
