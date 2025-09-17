# Setup Rápido - Barber Calendar ⚡

## 🚀 Início Rápido (5 minutos)

### 1. Configurar Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative **Authentication**, **Firestore** e **Cloud Messaging**
4. Copie as configurações do projeto

### 2. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite com suas credenciais do Firebase
nano .env
```

### 3. Instalar e Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

## 🔧 Configuração Detalhada

### Firebase Authentication

1. No Firebase Console, vá para **Authentication > Sign-in method**
2. Ative **Email/Password**
3. Configure domínios autorizados

### Firestore Database

1. Vá para **Firestore Database**
2. Crie o banco em modo de produção
3. Configure as regras de segurança (já incluídas no projeto)

### Cloud Messaging

1. Vá para **Cloud Messaging**
2. Gere uma chave VAPID
3. Adicione a chave no arquivo `.env`

## 📱 Testando o PWA

1. Abra o app no navegador
2. Clique no ícone de instalação na barra de endereços
3. O app será instalado como aplicativo nativo

## 🔔 Testando Notificações

1. Faça login no app
2. Permita notificações quando solicitado
3. Crie um agendamento para testar

## 🎨 Personalização

### Cores

Edite `tailwind.config.js` para personalizar as cores:

```javascript
theme: {
  extend: {
    colors: {
      barber: {
        500: '#f0751a', // Sua cor principal
        600: '#e15a10', // Cor mais escura
      }
    }
  }
}
```

### Logo

Substitua os ícones em `public/`:
- `icon-192.png`
- `icon-512.png`

## 🚀 Deploy

### Firebase Hosting (Recomendado)

```bash
# Build do projeto
npm run build

# Deploy
firebase deploy
```

### Outras Opções

- **Vercel**: `vercel --prod`
- **Netlify**: Upload da pasta `dist/`
- **GitHub Pages**: `npm run deploy`

## 📊 Estrutura de Dados

### Usuários

```typescript
{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'barber' | 'client';
  preferences?: object;
  createdAt: Date;
  updatedAt: Date;
}
```

### Agendamentos

```typescript
{
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  googleEventId?: string;
}
```

## 🔐 Segurança

### Regras do Firestore

As regras já estão configuradas para:
- Usuários só podem editar seus próprios dados
- Barbeiros podem ver todos os clientes
- Agendamentos só são visíveis para cliente e barbeiro

### Autenticação

- Email/senha obrigatório
- Sessões gerenciadas pelo Firebase
- Logout automático em caso de inatividade

## 📱 Recursos Mobile

- ✅ Design responsivo
- ✅ PWA instalável
- ✅ Notificações push
- ✅ Funciona offline
- ✅ Touch-friendly

## 🎯 Funcionalidades

### Para Barbeiros

- ✅ Visualizar agenda
- ✅ Gerenciar clientes
- ✅ Criar/editar agendamentos
- ✅ Histórico de clientes
- ✅ Integração Google Calendar
- ✅ Notificações

### Para Clientes

- ✅ Visualizar agendamentos
- ✅ Histórico pessoal
- ✅ Notificações de lembretes
- ✅ Perfil personalizado

## 🆘 Suporte

### Problemas Comuns

**Erro de build:**
```bash
npm run clean
rm -rf node_modules
npm install
```

**Erro de Firebase:**
- Verifique as credenciais no `.env`
- Confirme se os serviços estão ativados

**Erro de notificações:**
- Verifique se o VAPID key está correto
- Confirme permissões do navegador

### Logs

```bash
# Logs do Firebase
firebase functions:log

# Logs do navegador
F12 > Console
```

## 📈 Próximos Passos

1. **Personalize** as cores e logo
2. **Configure** o Google Calendar
3. **Teste** todas as funcionalidades
4. **Deploy** em produção
5. **Monitore** o uso

## 🎉 Pronto!

Seu sistema de agenda para barbearia está funcionando! 

**Recursos implementados:**
- ✅ Sistema completo de autenticação
- ✅ Agenda digital responsiva
- ✅ Histórico de clientes
- ✅ Notificações push
- ✅ PWA instalável
- ✅ Integração Google Calendar
- ✅ Firebase em tempo real

**Barber Calendar** - Sua barbearia digital! 💇‍♂️✨
