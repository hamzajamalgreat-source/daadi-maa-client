import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Toast notifications — positioned top-right, brand styled */}
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
            background: '#fff',
            color: '#2D1810',
            boxShadow: '0 4px 12px rgba(45, 24, 16, 0.12)',
            border: '1px solid #E8DDD3',
          },
          success: {
            iconTheme: {
              primary: '#8B1A1A',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#D32F2F',
              secondary: '#fff',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
