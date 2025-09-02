import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

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
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY} 
      afterSignOutUrl="/"
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#00f5c3',
          colorBackground: '#050505',
          colorText: '#e0e0e0',
          colorInputBackground: '#111111',
          colorInputText: '#e0e0e0',
          fontFamily: 'Inter, sans-serif',
        },
        elements: {
          card: {
            backgroundColor: '#111111',
            border: '1px solid #222222',
            boxShadow: 'none',
          },
          modalContent: {
             backgroundColor: '#111111',
             border: '1px solid #222222',
             boxShadow: '0 0 20px rgba(0, 245, 195, 0.1)',
          },
          socialButtonsBlockButton: {
            borderColor: '#222222',
            '&:hover': {
              backgroundColor: '#1c1c1c',
            },
          },
          dividerLine: {
            backgroundColor: '#222222',
          },
          formFieldInput: {
            backgroundColor: '#050505',
            borderColor: '#222222',
            '&:focus': {
              borderColor: '#00f5c3',
            },
          },
          formButtonPrimary: {
            backgroundColor: '#00f5c3',
            color: '#050505',
            '&:hover': {
              backgroundColor: '#00d1a7',
            },
            '&:focus': {
              backgroundColor: '#00d1a7',
            },
            '&:active': {
              backgroundColor: '#00d1a7',
            }
          },
          footerActionLink: {
            color: '#00f5c3',
            fontWeight: '500',
            '&:hover': {
              color: '#00d1a7',
              textDecoration: 'none',
            },
          },
          userButtonPopoverCard: {
            backgroundColor: '#111111',
            border: '1px solid #222222',
          },
          userButtonPopoverActionButton: {
             '&:hover': {
              backgroundColor: '#1c1c1c',
            },
          },
          userButtonPopoverActionButtonText: {
            color: '#e0e0e0',
          }
        },
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);