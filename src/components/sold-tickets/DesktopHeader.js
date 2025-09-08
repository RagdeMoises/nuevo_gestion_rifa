// src/components/DesktopHeader.js
import React from 'react';
import { useRaffle } from '../../context/RaffleContext.js';

const DesktopHeader = ({ activeTab, setActiveTab, fetchSoldTickets, onLogout }) => {
  const { state } = useRaffle();



  return (
    <div className="hidden md:flex justify-between items-center mb-4 bg-white shadow rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">Tickets Vendidos</h2>
        <div className="text-sm text-gray-600">
          Usuario: {state.userData?.username || 'Administrador'}
        </div>
      </div>
      
      
      <div className="flex items-center space-x-4">
        <button
          onClick={fetchSoldTickets}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Actualizar
        </button>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'table' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Tabla
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'cards' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
          >
            Tarjetas
          </button>
        </div>
        <button
          onClick={onLogout}
          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 w-11"
        >
          Salir
        </button>

        {/* <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 logout-btn"
        >
          Cerrar Sesión
        </button> */}
      </div>
    </div>
  );
};

export default DesktopHeader;