import React from 'react';

const EditModal = ({
  saleToEdit,
  editFormData,
  setEditFormData,
  handleEditFormChange,
  setIsEditModalOpen,
  saveEditChanges
}) => {
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsEditModalOpen(false)}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Editar Venta
                </h3>
                <div className="mt-2">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                        Nombre del cliente
                      </label>
                      <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={editFormData.customer_name}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="id_number" className="block text-sm font-medium text-gray-700">
                        Cédula
                      </label>
                      <input
                        type="text"
                        id="id_number"
                        name="id_number"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={editFormData.id_number}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={editFormData.phone}
                        onChange={handleEditFormChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Cantidad de tickets
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={editFormData.quantity}
                        onChange={handleEditFormChange}
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
                        Monto total
                      </label>
                      <input
                        type="number"
                        id="total_amount"
                        name="total_amount"
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={editFormData.total_amount}
                        onChange={handleEditFormChange}
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="tipo_venta" className="block text-sm font-medium text-gray-700">
                        Tipo de Venta
                      </label>
                      <select
                        id="tipo_venta"
                        name="tipo_venta"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value={editFormData.tipo_venta}
                        onChange={handleEditFormChange}
                        disabled
                      >
                        <option value="Bs">Bolívares (Bs)</option>
                        <option value="$">Dólares ($)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={saveEditChanges}
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;