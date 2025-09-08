import React from 'react';

const SalesTable = ({
  sortedTickets,
  requestSort,
  getClassNamesFor,
  openTicketsModal,
  openConfirmModal,
  openRejectModal,
  openReceiptModal,
  openEditModal,
  openDeleteModal,
  resendWhatsAppMessage,
  formatDate,
  getStatusBadge,
  hasReceipt,
  searchTerm,
  filterStatus
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeader 
                label="ID" 
                sortKey="id" 
                requestSort={requestSort} 
                getClassNamesFor={getClassNamesFor} 
              />
              <TableHeader 
                label="Cliente" 
                sortKey="customer_name" 
                requestSort={requestSort} 
                getClassNamesFor={getClassNamesFor} 
              />
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cédula/Teléfono
              </th>
              <TableHeader 
                label="Cantidad" 
                sortKey="quantity" 
                requestSort={requestSort} 
                getClassNamesFor={getClassNamesFor} 
              />
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tickets Comprados
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Venta
              </th>
              <TableHeader 
                label="Monto" 
                sortKey="total_amount" 
                requestSort={requestSort} 
                getClassNamesFor={getClassNamesFor} 
              />
              <TableHeader 
                label="Fecha" 
                sortKey="created_at" 
                requestSort={requestSort} 
                getClassNamesFor={getClassNamesFor} 
              />
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTickets.length > 0 ? (
              sortedTickets.map((sale, index) => (
                <TableRow
                  key={index}
                  sale={sale}
                  openTicketsModal={openTicketsModal}
                  openConfirmModal={openConfirmModal}
                  openRejectModal={openRejectModal}
                  openReceiptModal={openReceiptModal}
                  openEditModal={openEditModal}
                  openDeleteModal={openDeleteModal}
                  resendWhatsAppMessage={resendWhatsAppMessage}
                  formatDate={formatDate}
                  getStatusBadge={getStatusBadge}
                  hasReceipt={hasReceipt}
                />
              ))
            ) : (
              <EmptyTableRow searchTerm={searchTerm} filterStatus={filterStatus} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableHeader = ({ label, sortKey, requestSort, getClassNamesFor }) => {
  return (
    <th 
      scope="col" 
      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" 
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center">
        <span>{label}</span>
        {getClassNamesFor(sortKey) && (
          <svg className={`ml-1 h-4 w-4 ${getClassNamesFor(sortKey) === 'ascending' ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </th>
  );
};

const TableRow = ({
  sale,
  openTicketsModal,
  openConfirmModal,
  openRejectModal,
  openReceiptModal,
  openEditModal,
  openDeleteModal,
  resendWhatsAppMessage,
  formatDate,
  getStatusBadge,
  hasReceipt
}) => {
  const isBolivares = sale.tipo_venta === 'bolivares';
  
  return (
    <tr className={sale.confirmed ? 'bg-green-50 hover:bg-green-100' : 'bg-yellow-50 hover:bg-yellow-100'}>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
        {sale.id}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
        {sale.customer_name}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        <div>{sale.id_number}</div>
        <div>{sale.phone}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
        {sale.quantity}
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900">
          <div className="flex flex-wrap gap-1">
            {sale.tickets && sale.tickets.length > 0 ? (
              <>
                {sale.tickets.slice(0, 3).map((ticket, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {ticket}
                  </span>
                ))}
                {sale.tickets.length > 3 && (
                  <button
                    onClick={() => openTicketsModal(sale)}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    +{sale.tickets.length - 3} más
                  </button>
                )}
              </>
            ) : (
              <span className="text-xs text-gray-500">Sin tickets</span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isBolivares 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {isBolivares ? 'Bolívares' : 'Divisas'}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
        {isBolivares ? 'Bs' : '$'} {sale.total_amount}
        {/* Mostrar referencia solo si es bolívares */}
        {isBolivares && sale.payment_reference && (
          <div className="text-xs text-gray-500 mt-1">
            Ref: {sale.payment_reference}
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
        {formatDate(sale.created_at)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {getStatusBadge(sale.confirmed, sale.bank)}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
        <TableActions
          sale={sale}
          openConfirmModal={openConfirmModal}
          openRejectModal={openRejectModal}
          openReceiptModal={openReceiptModal}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
          resendWhatsAppMessage={resendWhatsAppMessage}
          hasReceipt={hasReceipt}
        />
      </td>
    </tr>
  );
};

const TableActions = ({
  sale,
  openConfirmModal,
  openRejectModal,
  openReceiptModal,
  openEditModal,
  openDeleteModal,
  resendWhatsAppMessage,
  hasReceipt
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {!sale.confirmed && (
        <>
          <button
            onClick={() => openConfirmModal(sale)}
            className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-2 py-1 rounded text-xs font-medium"
          >
            Confirmar
          </button>
          <button
            onClick={() => openRejectModal(sale)}
            className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs font-medium"
          >
            Rechazar
          </button>
        </>
      )}
      {hasReceipt(sale) && (
      <button
        onClick={() => openReceiptModal(sale.id)}
        className="text-purple-600 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded text-xs font-medium"
        title="Ver comprobante de pago"
      >
        <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      </button>
      )}
      <button
        onClick={() => openEditModal(sale)}
        className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-xs font-medium"
      >
        Editar
      </button>
      
      <button
        onClick={() => openDeleteModal(sale)}
        className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-xs font-medium"
      >
        Eliminar
      </button>
      
      {sale.confirmed && (
        <button
          onClick={() => resendWhatsAppMessage(sale)}
          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-xs font-medium"
        >
          Reenviar WhatsApp
        </button>
      )}
    </div>
  );
};

const EmptyTableRow = ({ searchTerm, filterStatus }) => {
  return (
    <tr>
      <td colSpan="11" className="px-6 py-4 text-center text-sm text-gray-500">
        {searchTerm || filterStatus !== 'all' 
          ? 'No se encontraron ventas que coincidan con los filtros' 
          : 'No hay tickets vendidos aún.'}
      </td>
    </tr>
  );
};

export default SalesTable;