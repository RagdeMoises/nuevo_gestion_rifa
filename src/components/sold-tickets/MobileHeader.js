// src/components/MobileHeader.js
import React from 'react';
import { useRaffle } from '../../context/RaffleContext.js';

const MobileHeader = ({ isMenuOpen, setIsMenuOpen, onLogout }) => {
  const { state } = useRaffle();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      onLogout();
    }
  };

  return (
    <div className="md:hidden flex justify-between items-center mb-2 px-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
        <div className="text-xs text-gray-600">
          Usuario: {state.userData?.username || 'Admin'}
        </div>
      </div>
      <div className="flex items-center space-x-4 ">
        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1 rounded text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-100"
        >
          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={handleLogout}
          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 logout-btn"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;