import React, { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 text-white font-bold text-xl p-2 rounded-md mr-2">
              RT
            </div>
            <span className="text-xl font-bold text-gray-800 hidden md:block">
              Rifa Tommy Moto
            </span>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('comprar')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Venta de Tickets
            </button>
            <button
              onClick={() => scrollToSection('pagos')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Métodos de Pago
            </button>
            <button
              onClick={() => scrollToSection('verificar')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Verificar Ticket
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contacto
            </button>
          </nav>

          {/* Botón de menú móvil */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('inicio')}
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors text-left"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('comprar')}
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors text-left"
              >
                Comprar Tickets
              </button>
              <button
                onClick={() => scrollToSection('pagos')}
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors text-left"
              >
                Métodos de Pago
              </button>
              <button
                onClick={() => scrollToSection('verificar')}
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors text-left"
              >
                Verificar Ticket
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="text-gray-700 hover:text-blue-600 font-medium py-2 transition-colors text-left"
              >
                Contacto
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;