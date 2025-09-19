import React from 'react';

const SalesCards = ({
  sortedTickets,
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
  return (
    <div className="bg-red">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
        {sortedTickets.length > 0 ? (
          sortedTickets.map((sale, index) => (
            <SaleCard
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
          <EmptyState />
        )}
      </div>
    </div>
  );
};

const SaleCard = ({
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
  const isZelle = sale.tipo_venta === 'zelle';
  //const isDivisas = sale.tipo_venta === 'divisas';
  
  // Determinar el texto y estilo según el tipo de venta
  let paymentTypeText = '';
  let paymentTypeClass = '';
  
  if (isBolivares) {
    paymentTypeText = 'Bolívares';
    paymentTypeClass = 'bg-blue-100 text-blue-800';
  } else if (isZelle) {
    paymentTypeText = 'Zelle';
    paymentTypeClass = 'bg-purple-100 text-purple-800';
  } else {
    paymentTypeText = 'Divisas';
    paymentTypeClass = 'bg-green-100 text-green-800';
  }

  return (
    <div className={`p-3 bg-white ${sale.confirmed ? 'border-l-3 border-l-green-500 rounded-lg' : 'border-l-3 border-l-green-500 rounded-lg'}`}>
      {/* Header compacto para móvil */}
      <div className="flex justify-between items-start m-5 ">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-2xl text-black-500 font-medium">{sale.id}</span>
            {getStatusBadge(sale.confirmed, sale.bank)}
          </div>
          
          <h4 className="text-sm font-semibold text-gray-700 truncate">{sale.customer_name}</h4>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-gray-500">
            <span className="truncate">{sale.id_number}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-gray-500">
            <span className="truncate">{sale.phone}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {sale.tickets && sale.tickets.slice(0, 2).map((ticket, i) => (
              <span key={i} className="inline-flex items-center px-1 py-0.5 rounded text-md font-medium bg-gray-100 text-blue-700">
                {ticket}
              </span>
            ))}
            {sale.tickets && sale.tickets.length > 2 && (
              <button
                onClick={() => openTicketsModal(sale)}
                className="inline-flex items-center px-1 py-0.5 rounded text-md font-medium bg-gray-100 text-blue-700 hover:bg-gray-200"
              >
                +{sale.tickets.length - 2}
              </button>
            )}
          </div>
        </div>
        
        <div className="text-right whitespace-nowrap pl-2">
          <span className="text-lg text-black-900">
            {sale.quantity} ticket{sale.quantity !== 1 ? 's' : ''}
          </span>
          <div className="text-xs text-gray-400 mt-0.5">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${paymentTypeClass}`}>
              {paymentTypeText}
            </span>
          </div>
          <div className="text-sm font-semibold text-green-600">
            {isBolivares ? 'Bs' : '$'} {sale.total_amount}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {formatDate(sale.created_at)}
          </div>
          {/* Referencia de pago (solo para bolívares y Zelle) */}
          {(isBolivares) && sale.payment_reference && (
            <div className={`mt-1.5 text-xs font-medium ${sale.payment_method === "duplicada" ? 'text-red-600' : 'text-gray-600'}`}>
              Ref: {sale.payment_reference} {sale.payment_method === "duplicada" && '(Duplicada)'}
            </div>
          )}
          {/* Referencia de pago (solo para bolívares y Zelle) */}
          {(isZelle) && sale.payment_reference && (
            <div className={`mt-1.5 text-xs font-medium ${sale.payment_method === "duplicada" ? 'text-red-600' : 'text-gray-600'}`}>
              <strong>Datos pago:</strong><br />
              {sale.zelle_email && <>{sale.zelle_email}<br /></>}
              {sale.zelle_phone && <>{sale.zelle_phone}<br /></>}
              {sale.zelle_observation && <>{sale.zelle_observation}<br /></>}
            </div>
          )}
        </div>
      </div>
      
      {/* Acciones para móvil - Diseño compacto */}
      <div className="flex flex-nowrap gap-1.5 mt-2.5 pt-2 border-t border-gray-100">
        {!sale.confirmed && sale.bank !== 'rechazada'? (
          <>
            <div className="flex gap-3 ml-auto w-1/3"></div>
              <button
                onClick={() => openConfirmModal(sale)}
                className="flex-1 min-w-[220px] px-2 py-1.5 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-300 focus:outline-none"
              >
                Confirmar
              </button>
              <button
                  onClick={() => openRejectModal(sale)}
                  className="flex-1 min-w-[30px] px-2 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-300 focus:outline-none"
                >
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => openEditModal(sale)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={() => openDeleteModal(sale)}
                className="p-1.5 text-red-300 hover:text-red-800 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            <div/>
          </>
        ) : ( sale.bank !== 'rechazada' && (
          <>
            <div className="flex gap-1 ml-auto">
              {hasReceipt(sale) && (
                <button
                  onClick={() => openReceiptModal(sale.id)}
                  className="p-1.5 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded"
                  title="Ver comprobante"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>                          
                </button>
              )}
              <button
                  onClick={() => openRejectModal(sale)}
                  className="flex-1 min-w-[30px] px-2 py-1.5 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-300 focus:outline-none"
                >
                <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => openEditModal(sale)}
                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => resendWhatsAppMessage(sale)}
                className="flex min-w-[50px] items-center justify-center p-1.5 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-400 focus:outline-none"
                title="Reenviar por WhatsApp"
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .160 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                </svg>
                
              </button>
            </div>
          </>
        ) 
        )}
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-8">
      <svg className="mx-auto h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-700">No se encontraron ventas</h3>
      <p className="mt-1 text-xs text-gray-500 px-4">
        No hay ventas que coincidan con los filtros aplicados.
      </p>
    </div>
  );
};

export default SalesCards;