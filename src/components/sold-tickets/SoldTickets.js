import React, { useState, useEffect, useMemo, useCallback  } from 'react';
import Statistics from './Statistics.js';
import Filters from './Filters.js';
import SalesTable from './SalesTable.js';
import SalesCards from './SalesCards.js';
import MobileHeader from './MobileHeader.js';
import MobileMenu from './MobileMenu.js';
import DesktopHeader from './DesktopHeader.js';
import TicketsModal from './modals/TicketsModal.js';
import ConfirmModal from './modals/ConfirmModal.js';
import EditModal from './modals/EditModal.js';
import DeleteModal from './modals/DeleteModal.js';
import ReceiptModal from './modals/ReceiptModal.js';
import LoadingComponent from './LoadingComponent.js';
import ErrorComponent from './ErrorComponent.js';
import RejectModal from './modals/RejectModal.js';

const SoldTickets = ( {onLogout}) => {
  const [soldTickets, setSoldTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'descending' });
  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [saleToConfirm, setSaleToConfirm] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saleToEdit, setSaleToEdit] = useState(null);
  const [saleToDelete, setSaleToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customer_name: '',
    id_number: '',
    phone: '',
    quantity: '',
    total_amount: '',
    tipo_venta: 'bolivares'
  });
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentReceiptUrl, setCurrentReceiptUrl] = useState('');
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');
  const [customStartDate, setCustomStartDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    //console.log('Custom Start Date Init:', `${year}-${month}-${day}`);
    return `${year}-${month}-${day}`; // Ejemplo: "2025-09-07"
  });
  const [customEndDate, setCustomEndDate] = useState(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      //console.log('Custom End Date Init:', `${year}-${month}-${day}`);
      return `${year}-${month}-${day}`; // Ejemplo: "2025-09-07"
  });
  const [isExporting, setIsExporting] = useState(false);
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    confirmedSales: 0,
    pendingSales: 0,
    totalTicketsSold: 0,
    confirmedTickets: 0,
    pendingTickets: 0,
    totalAmountBs: 0,
    totalAmountDolares: 0,
    totalRechazadas: 0,
    totalAmountZelle:0
  });
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [saleToReject, setSaleToReject] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');

  const token = localStorage.getItem('authToken');

  // Función para obtener la fecha actual en timezone de Venezuela (UTC-4)
  const handleFilterByStatus = (status) => {
    setActiveStatusFilter(status);
    setFilterStatus(status);
  };

  const getVenezuelaDate = () => {
    const now = new Date();
    // Venezuela está en UTC-4, pero JavaScript usa el timezone del navegador
    // Para obtener la fecha en Venezuela, necesitamos ajustar
    const timezoneOffset = now.getTimezoneOffset() * 60000; // offset en milisegundos
    const utcTime = now.getTime() + timezoneOffset;
    const venezuelaOffset = -4 * 60 * 60000; // UTC-4 en milisegundos
    //console.log('Venezuela Offset:', new Date(utcTime + venezuelaOffset));
    return new Date(utcTime + venezuelaOffset);
  };

  // Función para formatear fecha en formato YYYY-MM-DD para la API
  // const formatDateForAPI = (date) => {
  //   return date.toISOString().split('T')[0];
  // };

  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() es 0-indexado
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  // Obtener el rango de fechas según el filtro seleccionado
  const getDateRange = useCallback(() => {
    const venezuelaNow = getVenezuelaDate();
    
    switch (dateFilter) {
      case 'today':
        const todayStart = new Date(venezuelaNow);
        //console.log('Today Start:', todayStart);
        //todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(venezuelaNow);
        //console.log('Today End:', formatDateForAPI(todayStart));
        //todayEnd.setHours(23, 59, 59, 999);
        
        return {
          startDate: formatDateForAPI(todayStart),
          endDate: formatDateForAPI(todayEnd)
        };
      
      case 'yesterday':
        const yesterday = new Date(venezuelaNow);
        yesterday.setDate(venezuelaNow.getDate() - 1);
        //yesterday.setHours(0, 0, 0, 0);
        
        const yesterdayEnd = new Date(yesterday);
        //yesterdayEnd.setHours(23, 59, 59, 999);

        return {
          startDate: formatDateForAPI(yesterday),
          endDate: formatDateForAPI(yesterdayEnd)
        };
      
      // case 'week':
      //   const startOfWeek = new Date(venezuelaNow);
      //   startOfWeek.setDate(venezuelaNow.getDate() - venezuelaNow.getDay());
      //   startOfWeek.setHours(0, 0, 0, 0);
        
      //   const endOfWeek = new Date(venezuelaNow);
      //   endOfWeek.setDate(venezuelaNow.getDate() + (6 - venezuelaNow.getDay()));
      //   endOfWeek.setHours(23, 59, 59, 999);
        
      //   return {
      //     startDate: formatDateForAPI(startOfWeek),
      //     endDate: formatDateForAPI(endOfWeek)
      //   };
      
      // case 'month':
      //   const startOfMonth = new Date(venezuelaNow.getFullYear(), venezuelaNow.getMonth(), 1);
      //   startOfMonth.setHours(0, 0, 0, 0);
        
      //   const endOfMonth = new Date(venezuelaNow.getFullYear(), venezuelaNow.getMonth() + 1, 0);
      //   endOfMonth.setHours(23, 59, 59, 999);
        
      //   return {
      //     startDate: formatDateForAPI(startOfMonth),
      //     endDate: formatDateForAPI(endOfMonth)
      //   };
      
      case 'custom':
        if (customStartDate && customEndDate) {
          // Para fechas personalizadas, asumimos que el usuario las introduce en timezone local
          // y las convertimos al inicio y fin del día en Venezuela
          //const start = new Date(customStartDate);
          const start=customStartDate;
          //start.setHours(0, 0, 0, 0);
          
          const end = customEndDate;
          //end.setHours(23, 59, 59, 999);
          
          return {
            startDate: start,
            endDate: end
          };
        }
        return { startDate: '', endDate: '' };
      
      default:
        return { startDate: '', endDate: '' };
    }
  }, [dateFilter, customStartDate, customEndDate]);

  const fetchStatistics = useCallback(async () => {
    try {
      const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      //console.log('Statistics data:', data);
      
      if (data.success) {
        setSalesStats({
          totalSales: data.data.rows[0].totales,
          confirmedSales: data.data.rows[0].confirmadas,
          pendingSales: data.data.rows[0].pendientes,
          totalTicketsSold: data.data.rows[1].totales,
          confirmedTickets: data.data.rows[1].confirmadas,
          pendingTickets: data.data.rows[1].pendientes,
          totalAmountBs: data.data.rows[0].ingresos,
          totalAmountDolares: data.data.rows[1].ingresos,
          totalAmountZelle: data.data.rows[0].zelle,
          totalRechazadas: data.data.rows[0].rechazadas
        });
      } else {
        setError('Error al cargar las estadísticas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    }
  }, [token]);

  const fetchFilteredTickets = useCallback(async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange();
      
      let url = `https://backrifa-production.up.railway.app/api/tickets/sold/filtered?`;
      const params = new URLSearchParams();
      
      if (startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      }
      
      const response = await fetch(url + params.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSoldTickets(data.data);
      } else {
        setError('Error al cargar los tickets filtrados');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, [getDateRange, token]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics, soldTickets, saleToReject]);

  useEffect(() => {
    fetchFilteredTickets();
  }, [fetchFilteredTickets,saleToReject ]);

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      const { startDate, endDate } = getDateRange();
      
      let url = `https://backrifa-production.up.railway.app/api/tickets/export/excel?`;
      const params = new URLSearchParams();
      
      if (startDate && endDate) {
        params.append('startDate', startDate);
        params.append('endDate', endDate);
      }
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }
      
      const response = await fetch(url + params.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'ventas_tickets.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      window.URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Error al exportar a Excel:', error);
      setError('Error al exportar a Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const openConfirmModal = (sale) => {
    setSaleToConfirm(sale);
    setPaymentReference('');
    setIsConfirmModalOpen(true);
  };

  const confirmSale = async () => {
    if (!paymentReference.trim()) {
      setError('Por favor ingrese un número de referencia');
      return;
    }

    try {
      const response = await fetch(`https://backrifa-production.up.railway.app/api/tickets/confirm/${saleToConfirm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_reference: paymentReference
        })
      });

      const data = await response.json();

      if (data.success) {
        const ticketsResponse = await fetch(`https://backrifa-production.up.railway.app/api/tickets/sale/${saleToConfirm.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const ticketsData = await ticketsResponse.json();

        if (ticketsData.success) {
          const updatedSale = {
            ...saleToConfirm,
            confirmed: true,
            payment_reference: paymentReference,
            tickets: ticketsData.data.tickets || saleToConfirm.tickets || []
          };
          
          const whatsappMessage = prepareWhatsAppMessage(updatedSale, paymentReference);
          
          setSoldTickets(prevTickets =>
            prevTickets.map(ticket =>
              ticket.id === saleToConfirm.id ? updatedSale : ticket
            )
          );
          
          setIsConfirmModalOpen(false);
          setSaleToConfirm(null);
          setPaymentReference('');
          
          const whatsappUrl = `https://wa.me/${saleToConfirm.phone}?text=${encodeURIComponent(whatsappMessage)}`;
          window.open(whatsappUrl, '_blank');
          
          alert('Venta confirmada exitosamente! Se ha abierto WhatsApp para enviar los detalles.');
        } else {
          setError('Error al obtener los tickets actualizados');
        }
      } else {
        setError('Error al confirmar la venta');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    }
  };

  const prepareWhatsAppMessage = (sale, reference) => {
    const tickets = Array.isArray(sale.tickets) ? sale.tickets : [];

    const formattedTickets = tickets
      .map(ticket => `🔢 *${ticket}*`)
      .join('\n');

    return `¡Hola ${sale.customer_name || 'Cliente'}! 👋
✅ Tu compra de tickets para la *Rifa de la Moto DT-175 Nueva 2025* ha sido confirmada.

📋 *Detalles de tu compra:*
• 🧾 Número de transacción: ${sale.id || 'N/A'}
• 💳 Referencia de pago: ${reference || 'N/A'}
• 🎟️ Cantidad de tickets: ${sale.quantity || 0}
• 💰 Total pagado: ${sale.tipo_venta === 'bolivares' ? 'Bs' : '$'} ${sale.total_amount || 0}

🎫 *Tus números de tickets:*
━━━━━━━━━━━━━━━━━━
${formattedTickets}
━━━━━━━━━━━━━━━━━━

📅 *Fecha del sorteo:* 20 de Diciembre 2025  
📅 *Hora:* 10 PM
📍 *Loteria:* SUPER GANA 

✨ ¡Guárdalos bien y mucha suerte! 🍀

Si tienes dudas o necesitas ayuda, estamos para ti.`;
  };

  const resendWhatsAppMessage = (sale) => {
    if (!sale.confirmed) {
      alert('No se puede reenviar el mensaje porque la venta no está confirmada.');
      return;
    }

    const reference = sale.payment_reference || '';
    const whatsappMessage = prepareWhatsAppMessage(sale, reference);
    const whatsappUrl = `https://wa.me/${sale.phone}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openEditModal = (sale) => {
    setSaleToEdit(sale);
    setEditFormData({
      customer_name: sale.customer_name,
      id_number: sale.id_number,
      phone: sale.phone,
      quantity: sale.quantity,
      total_amount: sale.total_amount,
      tipo_venta: sale.tipo_venta || 'bolivares'
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEditChanges = async () => {
    try {
      const response = await fetch(`https://backrifa-production.up.railway.app/api/tickets/update/${saleToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData)
      });

      const data = await response.json();

      if (data.success) {
        setSoldTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === saleToEdit.id ? { ...ticket, ...editFormData } : ticket
          )
        );
        
        setIsEditModalOpen(false);
        setSaleToEdit(null);
        alert('Venta actualizada exitosamente!');
      } else {
        setError('Error al actualizar la venta');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    }
  };

  const openDeleteModal = (sale) => {
    setSaleToDelete(sale);
    setIsDeleteModalOpen(true);
  };

  const deleteSale = async () => {
    try {
      const response = await fetch(`https://backrifa-production.up.railway.app/api/tickets/delete/${saleToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (data.success) {
        setSoldTickets(prevTickets =>
          prevTickets.filter(ticket => ticket.id !== saleToDelete.id)
        );
        
        setIsDeleteModalOpen(false);
        setSaleToDelete(null);
        alert('Venta eliminada exitosamente!');
      } else {
        setError('Error al eliminar la venta');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    }
  };

  const openTicketsModal = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const hasReceipt = (sale) => {
    return sale.has_receipt || sale.receipt_image;
  };

  const openReceiptModal = async (saleId) => {
    try {
      setReceiptLoading(true);
      const token = localStorage.getItem('authToken');
      
      
      const response = await fetch(`https://backrifa-production.up.railway.app/api/tickets/receipt/${saleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar el comprobante');
      }
      
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      setCurrentReceiptUrl(imageUrl);
      setIsReceiptModalOpen(true);
    } catch (error) {
      console.error('Error al cargar el comprobante:', error);
      setError('No se pudo cargar el comprobante');
      setCurrentReceiptUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxMiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1iZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjhBIj5JbWFnZW4gbm8gZW5jb250cmFkYTwvdGV4dD4KPC9zdmc+');
    } finally {
      setReceiptLoading(false);
    }
  };

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    if (currentReceiptUrl && currentReceiptUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentReceiptUrl);
    }
    setCurrentReceiptUrl('');
  };

  const formatDate = (dateString) => {
    // Convertir a fecha local primero
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Caracas' // Especificar timezone de Venezuela
    };
    return date.toLocaleDateString('es-ES', options);
  };

  // const getStatusBadge = (confirmed) => {
  //   return confirmed ? (
  //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800">
  //       Confirmado
  //     </span>
  //   ) : (
  //     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-yellow-100 text-yellow-800">
  //       Pendiente
  //     </span>
  //   );
  // };
  const getStatusBadge = (confirmed, bank) => {
    return bank!=="rechazada" ? (
		confirmed ? (
		  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800 border-2 border-green-700">
			Confirmado
		  </span>
		) : (
		  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-yellow-200 text-yellow-800 border-2 border-yellow-700">
			Pendiente
		  </span>
		)
		):(
		  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-red-500 text-white border-2 border-red-700">
			Rechazada
		  </span>
		);
  };
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig.key) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const filteredTickets = useMemo(() => {
    return soldTickets.filter(ticket => {
      const matchesSearch = 
        ticket.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id_number.includes(searchTerm) ||
        ticket.phone.includes(searchTerm) ||
        (ticket.payment_reference && ticket.payment_reference.includes(searchTerm)) ||
        ticket.id.toString().includes(searchTerm) ||
        (ticket.tickets && ticket.tickets.some(t => t && t.includes(searchTerm)));

      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'confirmed' && ticket.confirmed && ticket.bank !== 'rechazada') ||
        (filterStatus === 'pending' && !ticket.confirmed && ticket.bank !== 'rechazada');
      
      return matchesSearch && matchesStatus;
    });
  }, [soldTickets, searchTerm, filterStatus]);

  const sortedTickets = useMemo(() => {
    let sortableItems = [...filteredTickets];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTickets, sortConfig]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  // Función para abrir modal de rechazo
  const openRejectModal = (sale) => {
    //console.log('Opening reject modal for sale:', sale);
    setSaleToReject(sale);
    setIsRejectModalOpen(true);
  };

  // Función para rechazar una venta
  const rejectSale = async () => {
    try {
      const response = await fetch(`https://backrifa-production.up.railway.app/api/tickets/reject/${saleToReject.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (data.success) {
        // Enviar mensaje de WhatsApp
        //console.log(saleToReject);
        const whatsappMessage = `¡Hola ${saleToReject.customer_name}! 👋\n\n❌ Su compra de tickets ha sido rechazada.\n\n📋 *Detalles de su compra:*\n• 🧾 Número de transacción: ${saleToReject.id}\n• 🎟️ Cantidad de tickets: ${saleToReject.quantity}\n• 💰 ${saleToReject.tickets ? 'Tickets: '+saleToReject.tickets.join(' ') : ''}  Total: ${saleToReject.tipo_venta === 'bolivares' ? 'Bs' : '$'} ${saleToReject.total_amount}\n\n📝 *Por favor verifique sus datos y realice la compra nuevamente.*\n\nSi necesita ayuda, estamos para asistirle.`;
        const whatsappUrl = `https://wa.me/${saleToReject.phone}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        //Actualizar el estado local
        setSoldTickets(prevTickets =>
          prevTickets.filter(ticket => ticket.id !== saleToReject.id)
        );
        
        setIsRejectModalOpen(false);
        setSaleToReject(null);
        alert('Venta rechazada exitosamente! Se ha enviado un mensaje al cliente.');
      } else {
        setError('Error al rechazar la venta');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servidor');
    }
  };
  //console.log('Sold sortedTickets:', sortedTickets);

  return (
<div className="min-h-screen bg-gray-300 py-4 px-2 sm:px-4 lg:px-8">
    <div className="max-w-7xl mx-auto">
        <MobileHeader 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          onLogout={onLogout}
        />
        
        {isMenuOpen && (
          <MobileMenu 
            fetchSoldTickets={fetchFilteredTickets}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}

        <DesktopHeader 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          fetchSoldTickets={fetchFilteredTickets}
          onLogout={onLogout}
        />

        <Statistics 
          salesStats={salesStats}
          setFilterStatus={setFilterStatus}
          filterStatus={filterStatus}
          onFilterByStatus={handleFilterByStatus} // Pasar la función de filtrado
          activeStatusFilter={activeStatusFilter} // Pasar el estado activo
        />

        <Filters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          isFiltersOpen={isFiltersOpen}
          setIsFiltersOpen={setIsFiltersOpen}
          isExporting={isExporting}
          exportToExcel={exportToExcel}
        />

        {activeTab === 'cards' && (
          <SalesCards 
            sortedTickets={sortedTickets}
            openTicketsModal={openTicketsModal}
            openConfirmModal={openConfirmModal}
            openReceiptModal={openReceiptModal}
            openRejectModal={openRejectModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            resendWhatsAppMessage={resendWhatsAppMessage}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            hasReceipt={hasReceipt}
          />
        )}

        {activeTab === 'table' && (
          <SalesTable 
            sortedTickets={sortedTickets}
            requestSort={requestSort}
            getClassNamesFor={getClassNamesFor}
            openTicketsModal={openTicketsModal}
            openConfirmModal={openConfirmModal}
            openReceiptModal={openReceiptModal}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            resendWhatsAppMessage={resendWhatsAppMessage}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            hasReceipt={hasReceipt}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
          />
        )}

        {isModalOpen && selectedSale && (
          <TicketsModal 
            selectedSale={selectedSale}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {isConfirmModalOpen && saleToConfirm && (
          <ConfirmModal 
            saleToConfirm={saleToConfirm}
            paymentReference={paymentReference}
            setPaymentReference={setPaymentReference}
            error={error}
            setIsConfirmModalOpen={setIsConfirmModalOpen}
            confirmSale={confirmSale}
            openReceiptModal={openReceiptModal}
            hasReceipt={hasReceipt}
          />
        )}

        {isEditModalOpen && saleToEdit && (
          <EditModal 
            saleToEdit={saleToEdit}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            handleEditFormChange={handleEditFormChange}
            setIsEditModalOpen={setIsEditModalOpen}
            saveEditChanges={saveEditChanges}
          />
        )}

        {isDeleteModalOpen && saleToDelete && (
          <DeleteModal 
            saleToDelete={saleToDelete}
            setIsDeleteModalOpen={setIsDeleteModalOpen}
            deleteSale={deleteSale}
          />
        )}

        {isReceiptModalOpen && (
          <ReceiptModal 
            currentReceiptUrl={currentReceiptUrl}
            receiptLoading={receiptLoading}
            closeReceiptModal={closeReceiptModal}
            error={error}
          />
        )}
        {isRejectModalOpen && saleToReject && (
          <RejectModal 
            saleToReject={saleToReject}
            setIsRejectModalOpen={setIsRejectModalOpen}
            rejectSale={rejectSale}
          />
        )}

      </div>
    </div>
  );
};

export default SoldTickets;