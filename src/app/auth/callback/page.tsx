'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erro no callback de autenticação:', error);
          setError('Erro na autenticação. Tente novamente.');
          setTimeout(() => router.push('/login'), 3000);
          return;
        }

        if (data?.session) {
          // Usuário autenticado com sucesso
          console.log('Usuário autenticado:', data.session.user);
          router.push('/dashboard'); // ou a página que você quiser redirecionar
        } else {
          // Nenhuma sessão encontrada
          router.push('/login');
        }
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado. Redirecionando...');
        setTimeout(() => router.push('/login'), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Processando autenticação...
          </h2>
          <p className="text-gray-600">
            Aguarde um momento enquanto validamos seu acesso.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Erro! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <p className="text-gray-600">
            Você será redirecionado para a página de login em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
