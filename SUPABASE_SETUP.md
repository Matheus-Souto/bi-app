# 🚀 Configuração do Supabase para Autenticação

## 1. **Criando Projeto no Supabase**

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Faça login com GitHub
4. Clique em "New Project"
5. Escolha uma organização
6. Preencha:
   - **Name**: `bi-app` (ou nome desejado)
   - **Database Password**: Senha forte (salve esta senha!)
   - **Region**: `South America (São Paulo)` ou mais próxima
7. Clique em "Create new project"

## 2. **Configurando Variáveis de Ambiente**

1. No dashboard do Supabase, vá em **Settings > API**
2. Copie as seguintes informações:

   - **Project URL**
   - **anon public key**

3. Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

## 3. **Configurando Autenticação**

### **📧 Email Authentication (Já configurado)**

Por padrão, o Supabase já vem com autenticação por email habilitada.

### **🔐 Google OAuth**

1. No dashboard do Supabase, vá em **Authentication > Providers**
2. Clique em **Google**
3. **Habilite** o provider
4. Configuração no Google Cloud Console:

#### **Google Cloud Console:**

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione existente
3. Vá em **APIs & Services > Credentials**
4. Clique em **+ CREATE CREDENTIALS > OAuth 2.0 Client IDs**
5. Configure:

   - **Application type**: Web application
   - **Name**: BI App Auth
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - **Authorized redirect URIs**:
     - `https://seu-projeto.supabase.co/auth/v1/callback`

6. Copie **Client ID** e **Client Secret**
7. Cole no Supabase (Authentication > Providers > Google)

## 4. **Configurando Database Schema**

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- 1. Criar tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas de segurança
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    email,
    company
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'firstName', NEW.raw_user_meta_data->>'first_name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'lastName', NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    NEW.raw_user_meta_data->>'company'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Trigger para executar a função
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger para updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 5. **Configurações de Email**

1. Vá em **Authentication > Settings**
2. Configure:
   - **Site URL**: `http://localhost:3000` (dev) ou seu domínio
   - **Redirect URLs**: Adicione URLs permitidas para redirect

### **📧 Email Templates (Opcional)**

Personalize os templates em **Authentication > Email Templates**

## 6. **Testando a Implementação**

1. Instale dependências: `npm install`
2. Configure `.env.local` com suas credenciais
3. Execute: `npm run dev`
4. Acesse: `http://localhost:3000/cadastro`
5. Teste cadastro com email
6. Verifique email de confirmação
7. Teste login em `http://localhost:3000/login`
8. Teste login social com Google
9. ✅ **Acesse o dashboard**: `http://localhost:3000/dashboard`

## 7. **URLs importantes**

- **Página Principal**: `/`
- **Cadastro**: `/cadastro`
- **Login**: `/login`
- **Callback OAuth**: `/auth/callback`
- **✅ Dashboard**: `/dashboard` - _Nova página criada!_

## 8. **🎯 Fluxo de Autenticação Completo**

### **📝 Fluxo do Usuário:**

1. **Usuário acessa** a página principal
2. **Clica em "Começar Agora"** → Redireciona para `/cadastro`
3. **Faz cadastro** com email/senha ou Google
4. **Confirma email** (se cadastro por email)
5. **Faz login** na página `/login`
6. **É redirecionado** para `/dashboard` automaticamente
7. **Acessa dashboard** com dados pessoais e funcionalidades

### **🔒 Recursos de Segurança:**

- ✅ **Proteção de rotas**: Dashboard só acessível se logado
- ✅ **Redirecionamento automático**: Usuário não logado vai para `/login`
- ✅ **Logout seguro**: Limpa sessão e redireciona para página inicial
- ✅ **Persistência de sessão**: Usuário permanece logado entre sessões
- ✅ **Validação de dados**: Formulários com validação robusta

### **📱 Dashboard Features:**

- ✅ **Header personalizado** com logo e informações do usuário
- ✅ **Avatar gerado automaticamente** com iniciais do usuário
- ✅ **Botão de logout** com confirmação
- ✅ **Dados do perfil** exibidos (nome, email, empresa)
- ✅ **Cards de estatísticas** (preparados para dados futuros)
- ✅ **Seção de primeiros passos** (expandível)
- ✅ **Design responsivo** consistente com o resto da aplicação

## 9. **Próximos Passos**

1. ✅ Autenticação implementada
2. ✅ Dashboard básico criado
3. 🔄 Implementar funcionalidades de BI
4. 🔄 Adicionar upload de dados
5. 🔄 Criar sistema de relatórios
6. 🔄 Implementar visualizações de dados
7. 🔄 Adicionar colaboração entre usuários
8. 🔄 Sistema de notificações

## 🔧 **Solução de Problemas**

### **Erro: "Invalid API key"**

- Verifique se as variáveis de ambiente estão corretas
- Reinicie o servidor: `npm run dev`

### **Google OAuth não funciona**

- Verifique URLs de redirect no Google Console
- Confirme que Client ID/Secret estão corretos no Supabase

### **Emails não chegam**

- Verifique spam/lixo eletrônico
- Configure domínio personalizado no Supabase (produção)

### **Usuário não é criado na tabela profiles**

- Verifique se o trigger foi criado corretamente
- Execute o SQL do schema novamente

### **Dashboard não carrega ou redireciona para login**

- Verifique se o usuário está realmente autenticado
- Confirme se a tabela `profiles` foi criada corretamente
- Verifique o console do browser para erros de JavaScript

### **Erro: "User not found" no dashboard**

- Execute novamente o SQL da função `handle_new_user()`
- Registre um novo usuário para testar o trigger automático
