import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { Toaster } from 'react-hot-toast';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PayPalScriptProvider options={{ "client-id": "AaRE4DOJwR-akzW2M6lVBlDQBHi8UzP8AUD" }}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </PayPalScriptProvider>
  </StrictMode>
);
