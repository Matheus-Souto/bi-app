'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  avatar_url?: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          router.push('/login');
          return;
        }

        // Buscar dados do perfil na tabela profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Erro ao buscar perfil:', profileError);
          // Usar dados do auth se não conseguir buscar o perfil
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata?.firstName || 'Usuário',
            lastName: session.user.user_metadata?.lastName || '',
            company: session.user.user_metadata?.company || '',
          });
        } else {
          setUser({
            id: profile.id,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            company: profile.company,
            avatar_url: profile.avatar_url,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Detectar se é mobile e ajustar estado inicial do sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      } else {
        setSidebarExpanded(true);
      }
    };

    // Configurar estado inicial
    handleResize();

    // Escutar mudanças no tamanho da tela
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erro no logout:', error);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Erro inesperado no logout:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const menuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z"
          />
        </svg>
      ),
    },
    {
      id: 'reports',
      name: 'Relatórios',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
    {
      id: 'data-sources',
      name: 'Fontes de Dados',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
          />
        </svg>
      ),
    },
    {
      id: 'settings',
      name: 'Configurações',
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando dashboard...
          </h2>
          <p className="text-gray-600">
            Aguarde um momento enquanto carregamos seus dados.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Overlay */}
      {sidebarExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        ${
          sidebarExpanded
            ? 'w-80 md:w-64' // Mobile: 320px (80% da tela), Desktop: 256px
            : 'w-16 md:w-16' // Mobile e Desktop: 64px quando colapsado
        } 
        bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col
        fixed md:relative z-50 h-screen
      `}
      >
        {/* Logo Section */}
        <div className="p-4 md:p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 w-8 h-8 md:w-8 md:h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              {sidebarExpanded && (
                <h1 className="ml-3 text-xl md:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Bie
                </h1>
              )}
            </div>

            {/* Close button for mobile when expanded */}
            {sidebarExpanded && (
              <button
                onClick={() => setSidebarExpanded(false)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 md:p-3 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.id} className="relative group">
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    // Fechar menu em mobile após selecionar
                    if (window.innerWidth < 768) {
                      setSidebarExpanded(false);
                    }
                  }}
                  className={`w-full flex items-center ${
                    sidebarExpanded
                      ? 'justify-start px-4 py-3'
                      : 'justify-center px-2 py-3'
                  } rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 transition-transform ${
                      !sidebarExpanded ? 'scale-100' : ''
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </span>
                  {sidebarExpanded && (
                    <span className="ml-3 truncate text-base">{item.name}</span>
                  )}
                </button>

                {/* Tooltip for collapsed sidebar - only on desktop */}
                {!sidebarExpanded && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg hidden md:block">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-2 md:p-4 border-t border-gray-200 flex-shrink-0">
          {sidebarExpanded ? (
            <div className="px-2">
              <div className="flex items-center mb-4">
                <div className="relative flex-shrink-0">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Foto de perfil"
                      className={`${
                        sidebarExpanded ? 'w-10 h-10' : 'w-8 h-8'
                      } rounded-full object-cover`}
                    />
                  ) : (
                    <div
                      className={`${
                        sidebarExpanded ? 'w-10 h-10' : 'w-8 h-8'
                      } bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-sm">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                        {user?.lastName?.[0]?.toUpperCase() || ''}
                      </span>
                    </div>
                  )}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => {
                  router.push('/perfil');
                }}
                className="w-full flex items-center justify-center px-4 py-2.5 mb-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar Perfil
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sair
              </button>
            </div>
          ) : (
            <div className="relative group flex flex-col items-center py-2">
              <div className="flex justify-center mb-3 w-full">
                <div className="relative flex-shrink-0">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Foto de perfil"
                      className={`${
                        sidebarExpanded ? 'w-10 h-10' : 'w-8 h-8'
                      } rounded-full object-cover`}
                    />
                  ) : (
                    <div
                      className={`${
                        sidebarExpanded ? 'w-10 h-10' : 'w-8 h-8'
                      } bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-sm">
                        {user?.firstName?.[0]?.toUpperCase() || 'U'}
                        {user?.lastName?.[0]?.toUpperCase() || ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Tooltip - only on desktop */}
              <div className="absolute left-full top-0 transform ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg hidden md:block">
                <div className="font-medium">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-gray-300">{user?.email}</div>
                <div className="absolute left-0 top-4 transform -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>

              {/* Edit Profile Button - Collapsed */}
              <button
                onClick={() => {
                  router.push('/perfil');
                }}
                className="w-full flex items-center justify-center p-2 mb-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors group relative"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>

                {/* Edit Profile Tooltip - only on desktop */}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg hidden md:block">
                  Editar Perfil
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>

                {/* Logout Tooltip - only on desktop */}
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg hidden md:block">
                  Sair
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="p-4 md:p-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative group"
          >
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                sidebarExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>

            {/* Toggle Tooltip - only on desktop */}
            {!sidebarExpanded && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg hidden md:block">
                Expandir Menu
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col overflow-hidden min-h-screen transition-all duration-300 ${
          sidebarExpanded ? 'ml-80 md:ml-64' : 'ml-16 md:ml-16'
        }`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Mobile menu button */}
                {!sidebarExpanded && (
                  <button
                    onClick={() => setSidebarExpanded(true)}
                    className="md:hidden mr-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                )}

                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
                    {activeSection === 'dashboard'
                      ? 'Dashboard'
                      : activeSection === 'data-sources'
                      ? 'Fontes de Dados'
                      : activeSection}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    {activeSection === 'dashboard' &&
                      'Visão geral dos seus dados e métricas'}
                    {activeSection === 'reports' &&
                      'Gerencie e crie relatórios personalizados'}
                    {activeSection === 'analytics' &&
                      'Análises avançadas e insights'}
                    {activeSection === 'data-sources' &&
                      'Conecte e gerencie suas fontes de dados'}
                    {activeSection === 'settings' &&
                      'Configurações da conta e preferências'}
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center space-x-2 md:space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a9 9 0 1118 0v10z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a9 9 0 1118 0v10z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
          {activeSection === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 md:mb-8">
                <div className="text-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Bem-vindo, {user.firstName}! 🎉
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 mb-6">
                    Sua jornada de transformar dados em insights poderosos
                    começa aqui.
                  </p>
                  {user.company && (
                    <p className="text-base md:text-lg text-gray-500">
                      <span className="font-medium">Empresa:</span>{' '}
                      {user.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 md:p-3 rounded-full bg-blue-100">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Relatórios
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        0
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 md:p-3 rounded-full bg-purple-100">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Dashboards
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        0
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                  <div className="flex items-center">
                    <div className="p-2 md:p-3 rounded-full bg-green-100">
                      <svg
                        className="w-5 h-5 md:w-6 md:h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 md:ml-4">
                      <p className="text-xs md:text-sm font-medium text-gray-600">
                        Insights
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900">
                        0
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Getting Started */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  🚀 Primeiros Passos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="p-4 md:p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                    <div className="text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        Criar Primeiro Relatório
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                        Importe seus dados e crie visualizações poderosas
                      </p>
                      <button
                        onClick={() => setActiveSection('reports')}
                        className="w-full px-3 md:px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Começar
                      </button>
                    </div>
                  </div>

                  <div className="p-4 md:p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-300 transition-colors">
                    <div className="text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                        Conectar Fontes de Dados
                      </h4>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                        Integre com suas bases de dados favoritas
                      </p>
                      <button
                        onClick={() => setActiveSection('data-sources')}
                        className="w-full px-3 md:px-4 py-2 bg-purple-600 text-white text-sm md:text-base rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Conectar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'reports' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Relatórios
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Esta funcionalidade estará disponível em breve.
                </p>
                <button className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 transition-colors">
                  Em Desenvolvimento
                </button>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Analytics
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Esta funcionalidade estará disponível em breve.
                </p>
                <button className="px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white text-sm md:text-base rounded-lg hover:bg-purple-700 transition-colors">
                  Em Desenvolvimento
                </button>
              </div>
            </div>
          )}

          {activeSection === 'data-sources' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Fontes de Dados
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Esta funcionalidade estará disponível em breve.
                </p>
                <button className="px-4 md:px-6 py-2 md:py-3 bg-green-600 text-white text-sm md:text-base rounded-lg hover:bg-green-700 transition-colors">
                  Em Desenvolvimento
                </button>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <svg
                    className="w-6 h-6 md:w-8 md:h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">
                  Configurações
                </h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Esta funcionalidade estará disponível em breve.
                </p>
                <button className="px-4 md:px-6 py-2 md:py-3 bg-gray-600 text-white text-sm md:text-base rounded-lg hover:bg-gray-700 transition-colors">
                  Em Desenvolvimento
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
