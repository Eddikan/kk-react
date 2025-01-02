import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import GoogleTranslate from './GoogleTranslate';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store, persistor } from './store'; // Import store and persistor

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
  
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId="766257099679-9tknmarbin95ka99g25km3eea92ergqb.apps.googleusercontent.com">
        <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_REACT_APP_PAYPAL_CLIENT_ID }}>
            <Provider store={store}>
                <PersistGate loading={<div></div>} persistor={persistor}>
                    <GoogleTranslate />
                    <App />
                </PersistGate>
            </Provider>
        </PayPalScriptProvider>
    </GoogleOAuthProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
