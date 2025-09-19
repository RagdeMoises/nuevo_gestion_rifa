import React from 'react';

const Statistics = ({ salesStats, onShowRejected, onFilterByStatus, activeStatusFilter  }) => {
  
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5 mb-6">
      <StatCard 
        title="Ventas"
        value={salesStats.totalSales}
        subtitle={`${salesStats.totalTicketsSold} tickets`}
        icon="users"
        color="blue"
        onClick={() => onFilterByStatus('all')}
        isActive={activeStatusFilter === 'all'}
      />
      <StatCard 
        title="Pendientes"
        value={salesStats.pendingSales}
        subtitle={`${salesStats.pendingTickets} tickets`}
        onClick={() => onFilterByStatus('pending')}
        icon="clock"
        color="yellow"
        isActive={activeStatusFilter === 'pending'}
      />
      
      <StatCard 
        title="Confirmadas"
        value={salesStats.confirmedSales}
        subtitle={`${salesStats.confirmedTickets} tickets`}
        onClick={() => onFilterByStatus('confirmed')}
        icon="check"
        color="green"
        isActive={activeStatusFilter === 'confirmed'}
      />
      
      <StatCard 
        title="Ingresos"
        value={
          <>
            {salesStats.totalAmountDolares.toLocaleString()}<br />
            {salesStats.totalAmountBs.toLocaleString()}<br />
            {salesStats.totalAmountZelle.toLocaleString()}
            
          </>
        }
        subtitle="Confirmadas"
        icon="currency"
        color="purple"
        smallText
      />
      
      <StatCard 
        title="Rechazadas"
        value={salesStats.totalRechazadas || 90}
        subtitle={`0 tickets`}
        icon="x"
        color="red"
        action={onShowRejected}
        actionText="Ver rechazadas"
      />
    </div>
  );
};

const StatCard = ({ title, value, subtitle, icon, color, smallText = false, action, actionText, onClick, isActive = false }) => {
  const iconColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500'
  };

  const icons = {
    users: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    check: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    clock: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    x: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    currency: (
      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  return (
    <div 
      onClick={onClick} 
      className={`bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
          isActive ? 'ring-4 ring-blue-500' : ''
        }`}
      >
      <div className="px-3 py-2 sm:p-4">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconColors[color]} rounded-md p-2`}>
            {icons[icon]}
          </div>
          <div className="ml-3 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className={`flex items-baseline ${smallText ? 'flex-col' : ''}`}>
                <div className={`${smallText ? 'text-xs font-semibold' : 'text-lg font-semibold'} text-gray-900`}>
                  {value}
                </div>
              </dd>
              <dd className="text-xs text-gray-500 mt-1">
                {subtitle}
              </dd>
            </dl>
          </div>
        </div>
        {action && actionText && (
          <div className="mt-2">
            <button
              onClick={action}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;