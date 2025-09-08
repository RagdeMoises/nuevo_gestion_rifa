import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [raffleInfo, setRaffleInfo] = useState({
    prize_name: 'Moto Yamaha DT 175',
    prize_description: 'Nueva motocicleta Yamaha DT 175, modelo 2025, color azul con detalles en blanco',
    draw_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ticketPrice: 10.00,
    availableTickets: 1000,
    soldTickets: 250
  });
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(false);

  // Cargar información de la rifa desde la API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backrifa-production.up.railway.app';
  
  useEffect(() => {
    const fetchRaffleInfo = async () => {
      try {
        console.log('Haciendo solicitud a la API...');
        
        const response = await fetch('https://backrifa-production.up.railway.app/api/tickets/raffle-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response recibida:', response);
        
        // Verifica si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        
        // Convierte la respuesta a JSON
        const data = await response.json();
        console.log('Datos JSON recibidos:', data);
        
        // Verifica la estructura de los datos
        if (data && data.success && data.data) {
          setRaffleInfo(data.data);
        } else {
          throw new Error('Formato de respuesta inválido del servidor');
        }
        
      } catch (error) {
        console.error('Error completo:', error);
        setError('Error: ' + error.message);
        setApiError(true);
      }
    };

    fetchRaffleInfo();
  }, []);

  // Actualizar countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const drawDate = new Date(raffleInfo.draw_date);
      const difference = drawDate - new Date();
      
      if (difference > 0) {
        setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((difference / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((difference / 1000 / 60) % 60));
        setSeconds(Math.floor((difference / 1000) % 60));
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [raffleInfo.draw_date]);

  const scrollToPurchase = () => {
    const element = document.getElementById('comprar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <section id="inicio" className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-10% left-5% w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-20% right-10% w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10% left-20% w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Imagen del premio */}
          <div className="md:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105">
              <img
                src="DT175.webp"
                alt={raffleInfo.prize_name}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold ml-2 mb-2 bg-clip-text text-white">
                    Premio Principal
                  </h3>
                  <p className="text-xl font-semibold">{raffleInfo.prize_name}</p>
                </div>
              </div>
              
              {/* Badge de "Nuevo" */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-2 px-4 rounded-full shadow-lg animate-pulse">
                ¡Nuevo Modelo 2025!
              </div>
            </div>
          </div>
          
          {/* Contenido de texto */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Gana una <span className="text-blue-600">{raffleInfo.prize_name}</span>
            </h1>
            
            <p className="text-lg text-gray-700 mb-8 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              {raffleInfo.prize_description}
            </p>

            <div className="mb-8 bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Precio por ticket</h3>
              <p className="text-4xl font-bold text-blue-600">${raffleInfo.ticketPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">Precio accesible para todos</p>
            </div>

            <button
              onClick={scrollToPurchase}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center mx-auto md:mx-0"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              Comprar Tickets Ahora
            </button>
          </div>
        </div>

        {/* Countdown Section */}
        <div className="mt-16 mb-12 p-8 bg-gradient-to-r from-blue-300 to-blue-600 rounded-2xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-1xl font-bold mb-6 text-center">¡El sorteo está cada vez más cerca!</h2>
            
            <div className="flex flex-nowrap justify-center gap-1 mb-6">
              {[
                { label: "Días", value: days },
                { label: "Horas", value: hours },
                { label: "Minutos", value: minutes },
                { label: "Segundos", value: seconds },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl py-4 px-4 text-2xl mb-2 min-w-[80px]">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <span className="text-sm font-medium text-white/90">{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center bg-black/10 p-4 rounded-xl">
             <p className="text-lg font-medium">
                Fecha del sorteo
              </p>
              <p className="text-lg font-medium">
                <strong>{formatDate(raffleInfo.draw_date)}</strong>
              </p>
              <p className="mt-2">
                Loteria: <strong>SUPER GANA 10 PM</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-blue-500 transform transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000</div>
            <div className="text-gray-600 font-medium">Tickets disponibles</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${(raffleInfo.availableTickets/(raffleInfo.availableTickets+raffleInfo.soldTickets))*100}%`}}></div>
              {/* <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${(raffleInfo.availableTickets/(raffleInfo.availableTickets+raffleInfo.soldTickets))*100}%`}}></div> */}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-green-500 transform transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl font-bold text-green-600 mb-2">{raffleInfo.soldTickets}</div>
            <div className="text-gray-600 font-medium">Tickets vendidos</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div className="bg-green-600 h-2.5 rounded-full" style={{width: `${(raffleInfo.soldTickets/(raffleInfo.availableTickets+raffleInfo.soldTickets))*100}%`}}></div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-md text-center border-t-4 border-purple-500 transform transition-all duration-300 hover:-translate-y-2">
            <div className="text-4xl font-bold text-purple-600 mb-2">1</div>
            <div className="text-gray-600 font-medium">Gran ganador</div>
            <p className="text-sm text-gray-500 mt-2">¡Podrías ser tú!</p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Hero;