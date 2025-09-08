// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { RaffleProvider } from './context/RaffleContext.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RaffleProvider>
      <App />
    </RaffleProvider>
  </React.StrictMode>
);