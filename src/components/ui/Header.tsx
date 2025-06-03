'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerHeight = 64; // 4rem = 64px (altura do header)
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });

      // Fechar menu mobile após o clique
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bie
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#recursos"
              onClick={e => handleSmoothScroll(e, 'recursos')}
              className="nav-link text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Recursos
            </a>
            <a
              href="#planos"
              onClick={e => handleSmoothScroll(e, 'planos')}
              className="nav-link text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Planos
            </a>
            <a
              href="#sobre"
              onClick={e => handleSmoothScroll(e, 'sobre')}
              className="nav-link text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Sobre
            </a>
            <a
              href="#contato"
              onClick={e => handleSmoothScroll(e, 'contato')}
              className="nav-link text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              Contato
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Entrar
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
              Começar Agora
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              <a
                href="#recursos"
                onClick={e => handleSmoothScroll(e, 'recursos')}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Recursos
              </a>
              <a
                href="#planos"
                onClick={e => handleSmoothScroll(e, 'planos')}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Planos
              </a>
              <a
                href="#sobre"
                onClick={e => handleSmoothScroll(e, 'sobre')}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Sobre
              </a>
              <a
                href="#contato"
                onClick={e => handleSmoothScroll(e, 'contato')}
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                Contato
              </a>
              <div className="px-3 py-2 space-y-2">
                <button className="block w-full text-left text-gray-600 hover:text-blue-600 transition-colors">
                  Entrar
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all w-full">
                  Começar Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
