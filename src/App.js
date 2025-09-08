// App.js (actualizado)
import React, { useState, useEffect } from 'react';
import './App.css';

import RaffleInfo from './components/RaffleInfo.js';
import SoldTickets from './components/sold-tickets/SoldTickets.js';

import Login from './components/Login.js'; // Importar el componente Login

function App() {
  const [raffleInfo, setRaffleInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('sold');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la aplicación
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      // Verificar si el token es válido
      verifyToken(token, JSON.parse(userData));
    } else {
      setLoading(false);
    }
    
    if (isAuthenticated) {
      fetchRaffleInfo();
    }
  }, [isAuthenticated]);

  const verifyToken = async (token, userData) => {
    try {
      const response = await fetch('https://backrifa-production.up.railway.app/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        // Token inválido, limpiar almacenamiento
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const fetchRaffleInfo = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/raffle-info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRaffleInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching raffle info:', error);
    }
  };

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      {/* <header className="app-header">
        <div className="header-content flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 px-4 py-2">
            <div className="text-left">
              <h1 className="text-lg font-semibold leading-tight">Rifas tomas (Moto DT-175)</h1>
              <p className="text-sm text-gray-100">Gestión de tickets y ventas</p>
            </div>

            <div className="user-info text-sm text-gray-100 sm:text-right">
              <span>Bienvenido, {user?.username}</span>
            </div>

            <button 
              onClick={handleLogout} 
              className="logout-btn bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded self-start sm:self-auto"
            >
              Cerrar Sesión
            </button>
          </div>

      </header> */}

      <nav className="tabs">
        <button 
          className={activeTab === 'sold' ? 'active' : ''} 
          onClick={() => setActiveTab('sold')}
        >
          Tickets Vendidos
        </button>
        <button 
          className={activeTab === 'info' ? 'active' : ''} 
          onClick={() => setActiveTab('info')}
        >
          Información
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'sold' && <SoldTickets onLogout={handleLogout} />}
        {activeTab === 'info' && <RaffleInfo raffleInfo={raffleInfo} onUpdate={fetchRaffleInfo} />}
      </main>
    </div>
  );
}

export default App;


