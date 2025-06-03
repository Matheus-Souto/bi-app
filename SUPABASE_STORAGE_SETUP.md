# Configuração do Supabase Storage para Avatars

## 🚀 SOLUÇÃO COMPLETA - Execute Tudo de Uma Vez

Se você está com problemas de RLS (Row Level Security), execute este script completo no **SQL Editor** do Supabase:

```sql
-- 🔄 SCRIPT COMPLETO - STORAGE E PROFILES
-- Execute tudo de uma vez no SQL Editor do Supabase

-- 1️⃣ Configurar Storage (avatars)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/*'];

-- 2️⃣ Remover políticas antigas do storage
DROP POLICY IF EXISTS "Avatar uploads" ON storage.objects;
DROP POLICY IF EXISTS "Avatar viewing" ON storage.objects;
DROP POLICY IF EXISTS "Avatar updates" ON storage.objects;
DROP POLICY IF EXISTS "Avatar deletes" ON storage.objects;

-- 3️⃣ Criar políticas do storage
CREATE POLICY "avatars_upload_policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "avatars_view_policy" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "avatars_update_policy" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "avatars_delete_policy" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 4️⃣ Configurar tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5️⃣ Remover políticas antigas da tabela profiles
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;

-- 6️⃣ Criar políticas da tabela profiles
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
```

### 🎯 Como Executar:

1. **Acesse:** [Supabase Dashboard](https://supabase.com/dashboard)
2. **Selecione** seu projeto
3. **Vá para:** SQL Editor (ícone de terminal no menu lateral)
4. **Cole** o script completo acima
5. **Clique** em "Run" (botão azul)
6. **Teste** na página de perfil clicando em "🔧 Testar Configurações"

---

## 🔄 RESET COMPLETO - Remover e Recriar Políticas (RECOMENDADO)

Se você tem políticas conflitantes ou quer começar do zero, use este script no **SQL Editor** do Supabase:

### Script Completo - Copie e Cole no SQL Editor:

```sql
-- 🗑️ PASSO 1: Remover TODAS as políticas existentes do bucket avatars
DROP POLICY IF EXISTS "Avatars são visíveis para todos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de avatars" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus avatars" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatar viewing for everyone" ON storage.objects;
DROP POLICY IF EXISTS "Avatar uploads for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Avatar updates for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Avatar deletions for authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "avatar_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatar_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatar_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatar_delete_policy" ON storage.objects;
DROP POLICY IF EXISTS "Avatar uploads for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Avatar viewing for everyone" ON storage.objects;
DROP POLICY IF EXISTS "Avatar updates for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Avatar deletions for authenticated users only" ON storage.objects;

-- 🔒 PASSO 2: Garantir que RLS está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ✅ PASSO 3: Criar políticas limpas e funcionais
CREATE POLICY "avatars_select_policy" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_policy" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "avatars_update_policy" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "avatars_delete_policy" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'avatars'
        AND auth.role() = 'authenticated'
    );
```

### 🎯 Instruções:

1. **Acesse:** [Supabase Dashboard](https://supabase.com/dashboard) → Seu Projeto → **SQL Editor**
2. **Cole** o script completo acima
3. **Execute** (botão "Run")
4. **Teste** o upload na página `/perfil`

### ✅ O que esse script faz:

- **Remove** todas as políticas antigas (evita conflitos)
- **Habilita** RLS na tabela storage.objects
- **Cria** 4 políticas limpas:
  - `SELECT`: Qualquer pessoa pode ver avatars
  - `INSERT`: Usuários autenticados podem fazer upload
  - `UPDATE`: Usuários autenticados podem atualizar
  - `DELETE`: Usuários autenticados podem deletar

### 🚨 Se der erro "must be owner of table objects":

Use a **interface gráfica** seguindo as instruções mais abaixo neste arquivo.

---

## 👤 CONFIGURAÇÃO DA TABELA PROFILES

Para que os usuários possam visualizar e editar seus perfis, é necessário configurar as políticas RLS para a tabela `profiles`:

### Script SQL para Políticas da Tabela Profiles:

```sql
-- 🔒 Habilitar RLS na tabela profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 🗑️ Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios perfis" ON profiles;

-- ✅ Criar políticas para a tabela profiles
CREATE POLICY "profiles_select_policy" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
```

### 🎯 Instruções para Políticas de Perfil:

1. **Acesse:** [Supabase Dashboard](https://supabase.com/dashboard) → Seu Projeto → **SQL Editor**
2. **Cole** o script acima
3. **Execute** (botão "Run")

### ✅ O que esse script faz:

- **🔒 Habilita** RLS na tabela `profiles`
- **👀 SELECT**: Usuários só podem ver seu próprio perfil
- **➕ INSERT**: Usuários só podem criar seu próprio perfil
- **✏️ UPDATE**: Usuários só podem atualizar seu próprio perfil

---

## ❌ Problema Identificado: Row Level Security (RLS)

Se você está recebendo o erro `"new row violates row-level security policy"`, as políticas RLS do storage não estão configuradas corretamente.

## 🚨 ERRO: "must be owner of table objects"

Se você recebeu este erro ao executar o SQL, significa que precisa usar a **interface gráfica** do Supabase ao invés do SQL direto.

## 🔧 Solução Via Interface Gráfica (RECOMENDADO)

### 1. Acesse Authentication > Policies

1. Vá para [seu projeto no Supabase](https://supabase.com/dashboard)
2. No menu lateral, clique em **Authentication**
3. Clique em **Policies**
4. Procure por **storage** na lista de schemas
5. Clique em **storage.objects**

### 2. Criar Políticas via Interface

Na seção **storage.objects**, clique em **New Policy** e crie cada uma dessas políticas:

#### Política 1: Visualização Pública

- **Policy name**: `Avatar viewing for everyone`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**:

```sql
bucket_id = 'avatars'
```

#### Política 2: Upload para Usuários Autenticados

- **Policy name**: `Avatar uploads for authenticated users`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**:

```sql
bucket_id = 'avatars'
```

#### Política 3: Update para Usuários Autenticados

- **Policy name**: `Avatar updates for authenticated users`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**:

```sql
bucket_id = 'avatars'
```

#### Política 4: Delete para Usuários Autenticados

- **Policy name**: `Avatar deletions for authenticated users`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**:

```sql
bucket_id = 'avatars'
```

### 3. Verificar se o RLS está Habilitado

Na mesma página **storage.objects**, verifique se **Enable RLS** está **ATIVADO** (toggle verde).

## 🎯 Guia Passo a Passo Simplificado

### Passo 1: Navegue até as Políticas

```
Supabase Dashboard → Authentication → Policies → storage → objects
```

### Passo 2: Habilite RLS (se não estiver habilitado)

- Verifique se há um toggle **"Enable RLS"** verde
- Se estiver vermelho/desabilitado, clique para ativar

### Passo 3: Crie 4 Políticas

Clique em **"New Policy"** 4 vezes e crie:

**1ª Política - Ver Avatars:**

```
Nome: Avatar viewing for everyone
Operação: SELECT
Roles: public
Expression: bucket_id = 'avatars'
```

**2ª Política - Upload Avatars:**

```
Nome: Avatar uploads for authenticated users
Operação: INSERT
Roles: authenticated
Expression: bucket_id = 'avatars'
```

**3ª Política - Atualizar Avatars:**

```
Nome: Avatar updates for authenticated users
Operação: UPDATE
Roles: authenticated
Expression: bucket_id = 'avatars'
```

**4ª Política - Deletar Avatars:**

```
Nome: Avatar deletions for authenticated users
Operação: DELETE
Roles: authenticated
Expression: bucket_id = 'avatars'
```

### Passo 4: Teste

- Volte para `/perfil`
- Tente fazer upload de uma imagem
- Deve funcionar! 🎉

## 🔧 Solução Rápida (SQL - Se você for admin)

### 1. Acesse o Painel do Supabase

- Vá para [seu projeto no Supabase](https://supabase.com/dashboard)
- Navegue para **SQL Editor**

### 2. Execute as Políticas RLS Corretas

Cole e execute este SQL no **SQL Editor**:

```sql
-- Habilitar RLS na tabela storage.objects (se não estiver habilitado)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam todos os avatars (público)
CREATE POLICY IF NOT EXISTS "Avatars são visíveis para todos" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Política para permitir que usuários façam upload de seus próprios avatars
CREATE POLICY IF NOT EXISTS "Usuários podem fazer upload de avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Política para permitir que usuários atualizem seus próprios avatars
CREATE POLICY IF NOT EXISTS "Usuários podem atualizar seus avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Política para permitir que usuários deletem seus próprios avatars
CREATE POLICY IF NOT EXISTS "Usuários podem deletar seus avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

### 3. Verifique a Configuração do Bucket

No painel do Supabase, vá para **Storage** > **avatars** e verifique:

- ✅ **Public bucket**: Deve estar **ATIVADO**
- ✅ **File size limit**: 5MB
- ✅ **Allowed MIME types**: `image/*`

## 🚨 Alternativa Simples (Para Teste)

Se as políticas acima não funcionarem, você pode usar uma configuração mais permissiva temporariamente:

```sql
-- REMOVER políticas existentes (se houver conflitos)
DROP POLICY IF EXISTS "Avatars são visíveis para todos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem fazer upload de avatars" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar seus avatars" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar seus avatars" ON storage.objects;

-- Criar políticas mais simples
CREATE POLICY "Avatar uploads for authenticated users only" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Avatar viewing for everyone" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Avatar updates for authenticated users only" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Avatar deletions for authenticated users only" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## 🔍 Como Verificar se Funcionou

1. Execute as políticas SQL acima
2. Volte para a página de perfil (`/perfil`)
3. Clique em "🔍 Executar Diagnóstico Completo"
4. Tente fazer upload de uma imagem

## 📝 Estrutura dos Arquivos

Os avatars são salvos com o padrão:

```
{user_id}_{timestamp}.{extensão}
```

Exemplo: `f47ac10b-58cc-4372-a567-0e02b2c3d479_1640995200000.jpg`

## ⚠️ Segurança

As políticas garantem que:

- ✅ Qualquer pessoa pode VER avatars (público)
- ✅ Apenas usuários autenticados podem FAZER UPLOAD
- ✅ Usuários só podem MODIFICAR/DELETAR seus próprios avatars

## 🆘 Se Ainda Não Funcionar

1. Verifique se o usuário está realmente autenticado
2. Confirme se o bucket `avatars` existe e está público
3. Tente a "Alternativa Simples" acima
4. Verifique os logs do Supabase em **Logs** > **Database**

## 1. Criação do Bucket

1. Acesse o painel do Supabase
2. Vá para **Storage** no menu lateral
3. Clique em **Create a new bucket**
4. Configure o bucket com as seguintes configurações:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Ativado** (permite acesso público às imagens)
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/*`

## 2. Configuração de Políticas (RLS)

### Política para Visualização (SELECT)

```sql
CREATE POLICY "Avatars são públicos para visualização" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### Política para Upload (INSERT)

```sql
CREATE POLICY "Usuários podem fazer upload de seus próprios avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Política para Atualização (UPDATE)

```sql
CREATE POLICY "Usuários podem atualizar seus próprios avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Política para Exclusão (DELETE)

```sql
CREATE POLICY "Usuários podem deletar seus próprios avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. Configuração Alternativa (Mais Simples)

Se preferir uma configuração mais simples, você pode usar estas políticas:

### Para visualização pública:

```sql
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### Para usuários autenticados (upload, update, delete):

```sql
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## 4. Estrutura de Arquivos

Os avatars são salvos com a seguinte nomenclatura:

```
{user_id}_{timestamp}.{extensão}
```

Exemplo: `123e4567-e89b-12d3-a456-426614174000_1639123456789.jpg`

## 5. Limitações Implementadas

- **Tipos de arquivo**: Apenas imagens (image/\*)
- **Tamanho máximo**: 5MB por arquivo
- **Segurança**: Cada usuário só pode gerenciar seus próprios avatars
- **Cache**: As imagens têm cache de 1 hora (3600 segundos)

## 6. URLs das Imagens

As URLs públicas das imagens seguem o padrão:

```
https://[SEU_PROJETO].supabase.co/storage/v1/object/public/avatars/[NOME_DO_ARQUIVO]
```

## 7. Testando a Configuração

Para testar se o storage está funcionando corretamente:

1. Acesse a página de perfil (`/perfil`)
2. Clique no ícone de câmera sobre o avatar
3. Selecione uma imagem (PNG, JPG, JPEG, etc.)
4. Verifique se a imagem é carregada corretamente
5. Teste também a remoção da imagem

## 8. Funcionalidades Implementadas

### Na Página de Perfil (`/perfil`):

- ✅ Upload de nova foto de perfil
- ✅ Visualização da foto atual
- ✅ Remoção da foto de perfil
- ✅ Validação de tipo e tamanho de arquivo
- ✅ Estados de loading durante upload
- ✅ Mensagens de feedback para o usuário

### Na Página do Dashboard (`/dashboard`):

- ✅ Exibição da foto de perfil na sidebar
- ✅ Fallback para avatar com iniciais quando não há foto
- ✅ Responsividade em diferentes tamanhos de tela

## 9. Resolução de Problemas

### Erro "Row Level Security"

Se você receber erros relacionados ao RLS, verifique se:

- O bucket foi criado corretamente
- As políticas foram aplicadas
- O usuário está autenticado

### Erro de Permissão

Se houver erros de permissão:

- Verifique se o bucket é público
- Confirme se as políticas estão ativas
- Teste com as políticas mais simples primeiro

### Imagem não carrega

Se a imagem não aparecer:

- Verifique se a URL está correta no banco de dados
- Confirme se o arquivo existe no storage
- Teste a URL diretamente no navegador

## 10. Próximos Passos

Funcionalidades que podem ser implementadas no futuro:

- Redimensionamento automático de imagens
- Suporte a múltiplos formatos
- Histórico de avatars
- Integração com CDN
- Compressão automática de imagens
