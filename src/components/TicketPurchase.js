// components/TicketPurchase.js
import React, { useState } from 'react';

const TicketPurchase = ({ raffleInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    phone: '',
    ticketQuantity: 1
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [saleDetails, setSaleDetails] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);
    
    try {
      const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setIsSuccess(true);
        setSaleDetails({
          saleId: data.saleId,
          ticketNumbers: data.ticketNumbers,
          totalAmount: data.totalAmount
        });
        setFormData({
          name: '',
          idNumber: '',
          phone: '',
          ticketQuantity: 1
        });
      } else {
        setIsSuccess(false);
      }
      setMessage(data.message);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
      setIsSuccess(false);
    }
  };

  return (
    <div className="ticket-purchase">
      <h2>Compra de Tickets</h2>
      
      {raffleInfo && (
        <div className="raffle-summary">
          <p><strong>Precio por ticket:</strong> ${raffleInfo.ticketPrice}</p>
          <p><strong>Tickets disponibles:</strong> {raffleInfo.availableTickets}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="purchase-form">
        <div className="form-group">
          <label htmlFor="name">Nombre completo:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="idNumber">Número de cédula:</label>
          <input
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Teléfono:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ticketQuantity">Cantidad de tickets:</label>
          <input
            type="number"
            id="ticketQuantity"
            name="ticketQuantity"
            min="1"
            value={formData.ticketQuantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">
          Comprar Tickets
        </button>
      </form>
      
      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      {saleDetails && isSuccess && (
        <div className="sale-details">
          <h3>Detalles de la compra</h3>
          <p><strong>ID de venta:</strong> {saleDetails.saleId}</p>
          <p><strong>Números de tickets:</strong> {saleDetails.ticketNumbers.join(', ')}</p>
          <p><strong>Total pagado:</strong> ${saleDetails.totalAmount}</p>
        </div>
      )}
    </div>
  );
};

export default TicketPurchase;