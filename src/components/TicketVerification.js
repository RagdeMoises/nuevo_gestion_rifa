// components/TicketVerification.js
import React, { useState } from 'react';

const TicketVerification = () => {
  const [formData, setFormData] = useState({
    ticketNumber: '',
    idNumber: ''
  });
  const [verificationResult, setVerificationResult] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setVerificationResult(null);
    
    try {
      const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.valid) {
          setVerificationResult(data.ticket);
          setMessage('Ticket válido');
        } else {
          setMessage('Ticket no válido');
        }
      } else {
        setMessage(data.message || 'Error en la verificación');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
    }
  };

  return (
    <div className="ticket-verification">
      <h2>Verificación de Ticket</h2>
      
      <form onSubmit={handleSubmit} className="verification-form">
        <div className="form-group">
          <label htmlFor="ticketNumber">Número de ticket:</label>
          <input
            type="text"
            id="ticketNumber"
            name="ticketNumber"
            value={formData.ticketNumber}
            onChange={handleChange}
            required
            placeholder="Ej: 1234"
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
            placeholder="Ej: 1234567890"
          />
        </div>
        
        <button type="submit" className="btn-primary">
          Verificar Ticket
        </button>
      </form>
      
      {message && (
        <div className={`message ${verificationResult ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      {verificationResult && (
        <div className="verification-details">
          <h3>Información del Ticket</h3>
          <p><strong>Número:</strong> {verificationResult.number}</p>
          <p><strong>Nombre:</strong> {verificationResult.customerName}</p>
          <p><strong>Cédula:</strong> {verificationResult.idNumber}</p>
          <p><strong>Teléfono:</strong> {verificationResult.phone}</p>
        </div>
      )}
    </div>
  );
};

export default TicketVerification;