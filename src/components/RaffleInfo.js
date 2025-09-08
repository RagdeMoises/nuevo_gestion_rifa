// components/RaffleInfo.js
import React, { useState } from 'react';
const token = localStorage.getItem('authToken');
const RaffleInfo = ({ raffleInfo, onUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    ticketPrice_bs: '',
    ticketPrice: '',
    moneda_bs: '',
    moneda: '',
    draw_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!raffleInfo) {
    return <div className="loading">Cargando información de la rifa...</div>;
  }

  const openEditModal = () => {
    setEditFormData({
      ticketPrice_bs: raffleInfo.ticketPrice_bs || '',
      ticketPrice: raffleInfo.ticketPrice || '',
      moneda_bs: raffleInfo.moneda_bs || '',
      moneda: raffleInfo.moneda || '',
      draw_date: raffleInfo.draw_date ? raffleInfo.draw_date.split('T')[0] : ''
    });
    setIsEditModalOpen(true);
    setError('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/raffle/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });


      const data = await response.json();

      if (data.success) {
        if (onUpdate) {
          onUpdate(data.data);
        }
        closeEditModal();
        alert('Información de la rifa actualizada exitosamente!');
      } else {
        setError(data.message || 'Error al actualizar la información');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="raffle-info">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-md font-bold ml-3">Información de la Rifa</h2>
        <button
          onClick={openEditModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center w-fit m-0in-w-0 m-5"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Modificar
        </button>
      </div>
      
      <div className="info-card bg-white p-6 rounded-lg shadow-md mb-4">
        <h3 className="text-md font-semibold mb-3">Premio</h3>
        <p className="mb-2"><strong>Nombre:</strong> Yamaha DT 175</p>
        <p className="mb-2"><strong>Precio por ticket Bs:</strong> {raffleInfo.ticketPrice_bs}</p>
        <p className="mb-2"><strong>Moneda:</strong> {raffleInfo.moneda_bs}</p>
        <p className="mb-2"><strong>Precio por ticket Divisa:</strong> {raffleInfo.ticketPrice}</p>
        <p className="mb-2"><strong>Moneda Divisa:</strong> {raffleInfo.moneda}</p>
      </div>
      
      <div className="info-card bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3">Importante</h3>
        <p className="mb-2"><strong>Fecha del sorteo:</strong> {new Date(raffleInfo.draw_date).toLocaleDateString()}</p>
        <p className="mb-2"><strong>Hora del sorteo:</strong> 10 PM</p>
        <p className="mb-2"><strong>Loteria:</strong> SUPER GANA</p>
      </div>

      {/* Modal de Edición */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Editar Información de la Rifa</h3>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por ticket (Bs)
                  </label>
                  <input
                    type="number"
                    name="ticketPrice_bs"
                    value={editFormData.ticketPrice_bs}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moneda (Bs)
                  </label>
                  <input
                    type="text"
                    name="moneda_bs"
                    value={editFormData.moneda_bs}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por ticket (Divisa)
                  </label>
                  <input
                    type="number"
                    name="ticketPrice"
                    value={editFormData.ticketPrice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Moneda (Divisa)
                  </label>
                  <input
                    type="text"
                    name="moneda"
                    value={editFormData.moneda}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha del Sorteo
                  </label>
                  <input
                    type="date"
                    name="draw_date"
                    value={editFormData.draw_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaffleInfo;