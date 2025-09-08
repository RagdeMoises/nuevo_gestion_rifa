import React, { useState, useEffect } from 'react';
const token = localStorage.getItem('authToken');
const PaymentMethods = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState('transferencia');

  // Cargar información de métodos de pago desde la API
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/raffle-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Payment methods response:', response); // Debug log
        
        if (response.ok) {
          const data = await response.json();
          //console.log('Bank accounts data:', data.data.bank_accounts); // Debug log
          if (data.data.bank_accounts) {
            
            setBankAccounts(data.data.bank_accounts);
          }
        }
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        // Datos de ejemplo en caso de error
        setBankAccounts([
          {
            bank: "Banco de Venezuela",
            account_type: "Corriente",
            account_number: "0102-1234-5678-9012",
            holder: "Rifas Motto S.A.",
            id: "bdv"
          },
          {
            bank: "Mercantil",
            account_type: "Ahorros",
            account_number: "0105-9876-5432-1098",
            holder: "Rifas Motto S.A.",
            id: "mercantil"
          },
          {
            bank: "Zelle",
            account_type: "Digital",
            account_number: "rifasmotto@zelle.com",
            holder: "Rifas Motto S.A.",
            id: "zelle"
          }
        ]);
      }
    };

    fetchPaymentMethods();
  }, []);
  

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('¡Número de cuenta copiado al portapapeles!');
    }).catch(err => {
      console.error('Error al copiar: ', err);
    });
  };

  return (
    <section id="pagos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Métodos de Pago</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Realiza tu pago mediante transferencia bancaria/ Pago móvil o Zelle. Una vez realizado el pago, 
          adjunta el comprobante en el formulario de compra de tickets.
        </p>

        {/* Tabs de métodos de pago */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex border-b border-gray-200">
            <button
              className={`py-4 px-6 font-medium text-lg ${activeTab === 'transferencia' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('transferencia')}
            >
              Transferencia Bancaria
            </button>
            <button
              className={`py-4 px-6 font-medium text-lg ${activeTab === 'zelle' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('zelle')}
            >
              Zelle
            </button>
          </div>

          {/* Contenido de Transferencia Bancaria */}
          {activeTab === 'transferencia' && (
            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-6">Cuentas Bancarias Disponibles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bankAccounts
                  .filter(account => account.bank !== 'Zelle')
                  .map((account) => (
                    <div key={account.id || account.bank} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold">{account.bank}</h4>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-600 block text-sm">Tipo de cuenta:</span>
                          <span className="font-medium">{account.account_type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 block text-sm">Número de cuenta:</span>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{account.account_number}</span>
                            <button 
                              onClick={() => copyToClipboard(account.account_number)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Copiar número de cuenta"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600 block text-sm">Titular:</span>
                          <span className="font-medium">{account.holder}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">Instrucciones para transferencia bancaria:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-blue-900">
                  <li>Realiza la transferencia por el monto correspondiente a la cantidad de tickets</li>
                  <li>Guarda el comprobante de la transferencia</li>
                  <li>Completa el formulario de compra de tickets</li>
                  <li>Adjunta el comprobante de pago en el formulario</li>
                  <li>Recibirás tus números de ticket por WhatsApp y correo electrónico</li>
                </ol>
              </div>
            </div>
          )}

          {/* Contenido de Zelle */}
          {activeTab === 'zelle' && (
            <div className="pt-8">
              <h3 className="text-xl font-semibold mb-6">Pago por Zelle</h3>
              
              {bankAccounts
                .filter(account => account.bank === 'Zelle')
                .map((account) => (
                  <div key={account.id || account.bank} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold">{account.bank}</h4>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-gray-600 block text-sm">Correo electrónico:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{account.account_number}</span>
                          <button 
                            onClick={() => copyToClipboard(account.account_number)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Copiar correo electrónico"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600 block text-sm">Titular:</span>
                        <span className="font-medium">{account.holder}</span>
                      </div>
                    </div>
                  </div>
                ))}
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-3">Instrucciones para pago con Zelle:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-green-900">
                  <li>Inicia sesión en tu aplicación de banca móvil</li>
                  <li>Selecciona la opción de enviar dinero con Zelle</li>
                  <li>Ingresa el correo electrónico de la rifa</li>
                  <li>Confirma que el nombre del destinatario es correcto</li>
                  <li>Envía el monto correspondiente a la cantidad de tickets</li>
                  <li>Completa el formulario de compra de tickets y adjunta el comprobante</li>
                  <li>Recibirás tus números de ticket por WhatsApp y correo electrónico</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="max-w-4xl mx-auto bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  • Una vez realizado el pago, puedes verificar el estado de tu transferencia contactándonos por WhatsApp.<br />
                  • Los tickets se asignarán una vez confirmado el pago.<br />
                  • Asegúrate de adjuntar correctamente el comprobante de pago en el formulario de compra.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;