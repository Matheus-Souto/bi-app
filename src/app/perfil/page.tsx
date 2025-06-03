'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

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

      // Buscar dados do perfil
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Perfil não existe, criar um novo
        console.log('Perfil não encontrado, criando novo perfil...');

        const newProfile = {
          id: session.user.id,
          email: session.user.email || '',
          first_name: session.user.user_metadata?.firstName || '',
          last_name: session.user.user_metadata?.lastName || '',
          company: session.user.user_metadata?.company || '',
          phone: '',
          avatar_url: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error('Erro ao criar perfil:', createError);
          setMessage('Erro ao criar perfil. Tente novamente.');
          return;
        }

        setUser(createdProfile);
        setFormData({
          firstName: createdProfile.first_name || '',
          lastName: createdProfile.last_name || '',
          company: createdProfile.company || '',
          phone: createdProfile.phone || '',
        });
      } else if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        setMessage('Erro ao carregar perfil. Tente recarregar a página.');
      } else {
        // Perfil encontrado
        setUser(profile);
        setFormData({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          company: profile.company || '',
          phone: profile.phone || '',
        });
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploadingAvatar(true);
      setMessage('');

      if (!user) {
        setMessage('Usuário não encontrado. Faça login novamente.');
        return;
      }

      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setMessage('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Verificar tamanho do arquivo (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('A imagem deve ter no máximo 5MB.');
        return;
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);

        // Tratar diferentes tipos de erro
        if (uploadError.message?.includes('bucket')) {
          setMessage('Erro: Bucket de avatars não configurado.');
        } else if (
          uploadError.message?.includes('permission') ||
          uploadError.message?.includes('policy') ||
          uploadError.message?.includes('row-level security') ||
          uploadError.message?.includes('Unauthorized')
        ) {
          setMessage(
            'Erro de permissão. Verifique as políticas RLS do storage.',
          );
        } else if (uploadError.message?.includes('size')) {
          setMessage('Erro: Arquivo muito grande. Máximo permitido: 5MB.');
        } else if (uploadError.message?.includes('type')) {
          setMessage(
            'Erro: Tipo de arquivo não permitido. Use apenas imagens.',
          );
        } else {
          setMessage(`Erro no upload: ${uploadError.message}`);
        }
        return;
      }

      // Obter URL pública da imagem
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      // Remover avatar antigo se existir
      if (user.avatar_url) {
        const oldFileName = user.avatar_url.split('/').pop();
        if (oldFileName && oldFileName !== fileName) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([oldFileName]);

          if (deleteError) {
            console.warn(
              'Não foi possível remover avatar antigo:',
              deleteError,
            );
          }
        }
      }

      // Atualizar URL do avatar no banco de dados
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao atualizar banco de dados:', updateError);
        setMessage(`Erro ao salvar: ${updateError.message}`);
        return;
      }

      // Atualizar estado local
      setUser(prev => (prev ? { ...prev, avatar_url: publicUrl } : null));
      setMessage('Foto de perfil atualizada com sucesso!');

      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      console.error('Erro inesperado ao fazer upload do avatar:', error);
      setMessage('Erro inesperado ao atualizar foto de perfil.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploadingAvatar(true);

      if (!user || !user.avatar_url) return;

      // Remover arquivo do storage
      const fileName = user.avatar_url.split('/').pop();
      if (fileName) {
        await supabase.storage.from('avatars').remove([fileName]);
      }

      // Atualizar banco de dados
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Atualizar estado local
      setUser(prev => (prev ? { ...prev, avatar_url: undefined } : null));
      setMessage('Foto de perfil removida com sucesso!');

      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error: unknown) {
      console.error('Erro ao remover avatar:', error);
      setMessage('Erro ao remover foto de perfil. Tente novamente.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      if (!user) {
        setMessage('Usuário não encontrado. Faça login novamente.');
        return;
      }

      // Validações básicas
      if (!formData.firstName.trim()) {
        setMessage('O nome é obrigatório.');
        setSaving(false);
        return;
      }

      if (!formData.lastName.trim()) {
        setMessage('O sobrenome é obrigatório.');
        setSaving(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          company: formData.company.trim() || null,
          phone: formData.phone.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Erro detalhado ao salvar:', error);

        // Tratamento específico para erros RLS
        if (
          error.code === '42501' ||
          error.message?.includes('row-level security')
        ) {
          setMessage(
            '❌ Erro de permissão: As políticas RLS da tabela "profiles" não estão configuradas corretamente. Consulte o arquivo SUPABASE_STORAGE_SETUP.md para configurar as políticas.',
          );
          return;
        }

        if (error.code === 'PGRST116') {
          setMessage(
            'Perfil não encontrado. Recarregue a página e tente novamente.',
          );
        } else if (error.code === '23505') {
          setMessage(
            'Erro: Dados duplicados. Verifique se o email não está sendo usado por outro usuário.',
          );
        } else if (
          error.message?.includes('permission') ||
          error.message?.includes('Unauthorized')
        ) {
          setMessage(
            'Erro de permissão. Verifique se as políticas RLS estão configuradas corretamente.',
          );
        } else {
          setMessage(`Erro ao salvar: ${error.message}`);
        }
        return;
      }

      // Atualizar estado local com os dados salvos
      setUser(data);
      setMessage('✅ Perfil atualizado com sucesso!');
      setIsEditing(false);

      // Limpar mensagem após 5 segundos para mensagem de sucesso
      setTimeout(() => setMessage(''), 5000);
    } catch (error: unknown) {
      console.error('Erro inesperado ao salvar perfil:', error);
      setMessage('Erro inesperado ao atualizar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      company: user?.company || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando perfil...
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gerencie suas informações pessoais
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes('sucesso')
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              <svg
                className={`w-5 h-5 mr-2 ${
                  message.includes('sucesso')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {message.includes('sucesso') ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
              {message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
              {/* Avatar Section */}
              <div className="relative mb-4 mx-auto w-24 h-24">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Foto de perfil"
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">
                      {user.first_name?.[0]?.toUpperCase() || 'U'}
                      {user.last_name?.[0]?.toUpperCase() || ''}
                    </span>
                  </div>
                )}

                {/* Avatar Upload/Edit Button */}
                <button
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingAvatar ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remove Avatar Button */}
              {user.avatar_url && (
                <button
                  onClick={removeAvatar}
                  disabled={uploadingAvatar}
                  className="mb-4 text-xs text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remover foto
                </button>
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              {user.company && (
                <p className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full inline-block">
                  {user.company}
                </p>
              )}

              {/* Account Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-left">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Informações da Conta
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  {user.created_at && (
                    <div className="flex justify-between">
                      <span>Membro desde:</span>
                      <span>
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-medium">Ativo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Informações Pessoais
              </h3>

              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-6">
                  {/* First Name and Last Name Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome *
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Seu nome"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 break-words">
                          {user.first_name || 'Não informado'}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sobrenome *
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Seu sobrenome"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 break-words">
                          {user.last_name || 'Não informado'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email - Full Width */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-500 cursor-not-allowed break-all">
                      <span className="block">{user.email}</span>
                      <span className="text-xs text-gray-400 block mt-1">
                        (não editável)
                      </span>
                    </div>
                  </div>

                  {/* Phone and Company Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="(11) 99999-9999"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 break-words">
                          {user.phone || 'Não informado'}
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Empresa
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Nome da sua empresa"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 break-words">
                          {user.company || 'Não informado'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions - Mobile */}
                {isEditing && (
                  <div className="mt-8 flex flex-col sm:flex-row gap-3 md:hidden">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Salvar Alterações
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Segurança
              </h3>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Alterar Senha
                      </h4>
                      <p className="text-sm text-gray-500">
                        Atualize sua senha para manter sua conta segura
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
