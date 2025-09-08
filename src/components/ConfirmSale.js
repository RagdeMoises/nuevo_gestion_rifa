// components/ConfirmSale.js
import React, { useState } from 'react';
const token = localStorage.getItem('authToken');

const ConfirmSale = () => {
  const [saleId, setSaleId] = useState('');
  const [saleDetails, setSaleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'

  const fetchSaleDetails = async () => {
    if (!saleId) {
      setMessage('Por favor ingresa un ID de venta');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://backrifa-production.up.railway.app/api/tickets/sale-details/${saleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      const data = await response.json();
      
      if (data.success) {
        setSaleDetails(data.sale);
        setMessage('');
        setMessageType('');
      } else {
        setMessage(data.message || 'Error al buscar la venta');
        setMessageType('error');
        setSaleDetails(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
      setMessageType('error');
      setSaleDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const confirmSale = async () => {
    console.log('Confirming sale with ID:', saleId);
    setLoading(true);
    try {
      const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/confirm-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ saleId }),
      });
      
      const data = await response.json();
      console.log('Response data xxxxxxxxxxxxx:', data);
      if (data.success) {
        setMessage('Venta confirmada exitosamente');
        setMessageType('success');
        setSaleDetails(data.sale);
        
        // Preparar mensaje para WhatsApp
        const whatsappMessage = prepareWhatsAppMessage(data.sale, data.ticketNumbers);
        
        // Mostrar enlace de WhatsApp
        const whatsappUrl = `https://wa.me/${data.sale.phone}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        setMessage(data.message || 'Error al confirmar la venta');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error al conectar con el servidor');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const prepareWhatsAppMessage = (sale, ticketNumbers) => {
    return `¡Hola ${sale.customer_name}! 👋

✅ Tu compra de tickets para la Rifa de la Moto DT-175 Nueva 2025 ha sido confirmada.

📋 Detalles de tu compra:
• Número de transacción: ${sale.id}
• Cantidad de tickets: ${sale.quantity}
• Total pagado: Bs. ${sale.total_amount_bs}

🎫 Tus números de tickets:
${ticketNumbers.join(', ')}

📅 Fecha del sorteo: 20 Diciembre 2025
🧮 Loteria: SUPER GANA
📅 Hora: 10:00 PM


¡Mucha suerte! 🍀

Para más información, contáctanos.`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirmar Venta y Enviar Tickets</h2>
          <p className="text-lg text-gray-600">Gestiona la confirmación de ventas y envío de tickets por WhatsApp</p>
        </div>
        
        {/* Búsqueda de venta */}
        <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">Buscar Venta por ID</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="saleId" className="block text-sm font-medium text-gray-700 mb-1">
                ID de Venta
              </label>
              <input
                type="text"
                id="saleId"
                value={saleId}
                onChange={(e) => setSaleId(e.target.value)}
                placeholder="Ingresa el ID de la venta"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <button 
              onClick={fetchSaleDetails} 
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Buscando...
                </span>
              ) : 'Buscar Venta'}
            </button>
          </div>
        </div>
        
        {/* Mensaje de estado */}
        {message && (
          <div className={`p-4 rounded-md mb-6 ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <div className="flex items-start">
              {messageType === 'success' ? (
                <svg className="w-5 h-5 mr-3 mt-0.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-3 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message}</span>
            </div>
          </div>
        )}
        
        {/* Detalles de la venta */}
        {saleDetails && (
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Detalles de la Venta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre</p>
                <p className="text-lg font-semibold text-gray-900">{saleDetails.customer_name}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Cédula</p>
                <p className="text-lg font-semibold text-gray-900">{saleDetails.id_number}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-lg font-semibold text-gray-900">{saleDetails.phone}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Cantidad</p>
                <p className="text-lg font-semibold text-gray-900">{saleDetails.quantity} tickets</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-lg font-semibold text-green-600">${saleDetails.total_amount}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <p className={`text-lg font-semibold ${saleDetails.confirmed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {saleDetails.confirmed ? 'Confirmada' : 'Pendiente'}
                </p>
              </div>
            </div>
            
            {/* Números de tickets si están disponibles */}
            {saleDetails.tickets && saleDetails.tickets.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Números de Tickets</p>
                <div className="flex flex-wrap gap-2">
                  {saleDetails.tickets.map((ticket, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {ticket}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {!saleDetails.confirmed ? (
                <button 
                  onClick={confirmSale} 
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Confirmando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Confirmar Venta y Enviar por WhatsApp
                    </span>
                  )}
                </button>
              ) : (
                <>
                  <div className="flex-1 bg-green-50 p-4 rounded-md border border-green-200">
                    <p className="text-green-800 font-medium flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      ✅ Esta venta ya ha sido confirmada
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const whatsappMessage = prepareWhatsAppMessage(saleDetails, saleDetails.tickets || []);
                      const whatsappUrl = `https://wa.me/${saleDetails.phone}?text=${encodeURIComponent(whatsappMessage)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    className="px-6 py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Reenviar por WhatsApp
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Información adicional */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="text-lg font-medium text-yellow-800 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Información Importante
          </h4>
          <ul className="list-disc pl-5 text-yellow-700 space-y-1">
            <li>Confirma solo ventas que hayan sido pagadas y verificadas</li>
            <li>El sistema abrirá automáticamente WhatsApp con el mensaje preparado</li>
            <li>Revisa que los datos del cliente sean correctos antes de confirmar</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSale;