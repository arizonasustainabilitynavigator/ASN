import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { supabase } from './lib/supabase';
import './index.css';

function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}

// Supabase's OAuth redirect puts the session in the URL as a hash fragment
// (#access_token=...), which HashRouter would otherwise misread as a route
// and 404 on, racing Supabase's own parsing of that same hash. Waiting for
// getSession() first lets Supabase consume and clean up the hash before
// HashRouter ever looks at it.
//
// getSession() also *clears* that hash as part of parsing it — before
// AuthProvider ever mounts and subscribes to onAuthStateChange. That means
// the PASSWORD_RECOVERY event Supabase fires during this parsing has no
// listener yet and is lost forever, and by the time React mounts, the
// "type=recovery" signal is already gone from the URL too. Stash it here,
// synchronously, before it disappears, so AuthContext can still act on it.
if (window.location.hash.includes("type=recovery")) {
  sessionStorage.setItem("asn_pending_password_recovery", "1");
}

supabase.auth.getSession().finally(renderApp);
