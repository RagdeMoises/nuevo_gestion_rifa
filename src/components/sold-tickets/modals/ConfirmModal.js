import React from 'react';

const ConfirmModal = ({
  saleToConfirm,
  paymentReference,
  setPaymentReference,
  error,
  setIsConfirmModalOpen,
  confirmSale,
  openReceiptModal,
  hasReceipt
}) => {
  // Determinar si es una venta en bolívares
  const isBolivares = saleToConfirm?.tipo_venta === 'bolivares' || 
                      saleToConfirm?.tipo_venta === 'Bs.' || 
                      saleToConfirm?.tipo_venta === 'bs';
  setPaymentReference(saleToConfirm?.payment_reference || '');

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es 0-indexado
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsConfirmModalOpen(false)}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Confirmar Venta
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    ¿Estás seguro de que deseas confirmar la venta Id <strong>{saleToConfirm.id}</strong>  de <strong>{saleToConfirm.customer_name}</strong>?
                  </p>
                  <hr className="my-4 border-gray-300" />
                  <div className="mt-4">
                      <p>{saleToConfirm.quantity} tickets</p>
                      <strong>{saleToConfirm.tipo_venta === 'divisas' ? '$' : 'Bs'} {saleToConfirm.total_amount}</strong>
                      <p>{formatDateForAPI(new Date(saleToConfirm.payment_date))}</p>
                  </div>
                  
                  {/* Mostrar referencia de pago solo para ventas en bolívares */}
                  {isBolivares && (
                    <div className="mt-4">
                      {/* <p><strong>{saleToConfirm.quantity} tickets</strong></p>
                      <strong>{saleToConfirm.tipo_venta === 'divisas' ? '$' : 'Bs'} {saleToConfirm.total_amount}</strong>
                      <p>{formatDateForAPI(new Date(saleToConfirm.payment_date))}</p> */}
                      <label htmlFor="payment_reference" className="block text-sm font-medium text-gray-700">
                        Número de referencia de pago
                      </label>
                      {/* <input
                        type="text"
                        id="payment_reference"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm lg:text-md border-gray-300 rounded-md bg-gray-100"
                        placeholder="Referencia de pago"
                        value={paymentReference}
                        readOnly // Hacer el campo de solo lectura
                        disabled // Deshabilitar el campo
                      /> */}
                      <div className={`mt-1.5 text-md font-medium ${saleToConfirm.payment_method === "duplicada" ? 'text-red-600' : 'text-gray-600'}`}>
                        {saleToConfirm.payment_reference} {saleToConfirm.payment_method === "duplicada" && '(Duplicada)'}
                      </div>
                      {/* <p className="mt-1 text-xs text-gray-500">
                        Referencia registrada al momento de la compra
                      </p> */}
                    </div>
                  )}
                  <hr className="my-4 border-gray-300" />
                    <>
                    {/* <strong>{saleToConfirm.tipo_venta === 'divisas' ? '$' : 'Bs'} {saleToConfirm.total_amount}</strong> */}
                    </>
                      
                  
                  
                  {saleToConfirm && (
                    <div className="mt-4">
                      {hasReceipt(saleToConfirm) && (
                      <button
                        onClick={() => openReceiptModal(saleToConfirm.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Ver Comprobante de Pago
                      </button>
                      )}
                    </div>
                  )}
                  {error && (
                    <div className="mt-2 text-sm text-red-600">
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse mt-0">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={confirmSale}
            >
              Confirmar
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;