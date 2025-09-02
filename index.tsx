import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// The environment variable `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` was not available at runtime.
// To fix the application startup error, the key has been hardcoded.
// In a production environment, this should be configured via environment variables.
const PUBLISHABLE_KEY = 'pk_test_bWlnaHR5LXNwYXJyb3ctNjQuY2xlcmsuYWNjb3VudHMuZGV2JA';

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key.");
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
