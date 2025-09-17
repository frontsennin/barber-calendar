# Barber Calendar 💇‍♂️

Sistema completo de agenda para barbearia com integração ao Google Calendar e notificações push.

## 🚀 Funcionalidades

- ✅ **Sistema de Autenticação** - Login e cadastro para barbeiros e clientes
- ✅ **Agenda Digital** - Visualização em calendário com agendamentos
- ✅ **Histórico de Clientes** - Acompanhamento de preferências e histórico
- ✅ **Responsivo** - Funciona perfeitamente em mobile, tablet e desktop
- ✅ **PWA** - Pode ser instalado como app no celular
- ✅ **Notificações Push** - Lembretes e confirmações
- ✅ **Integração Google Calendar** - Sincronização automática
- ✅ **Firebase** - Banco de dados em tempo real

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Firebase** (Auth, Firestore, Cloud Messaging)
- **React Hook Form** com validação Yup
- **Date-fns** para manipulação de datas
- **Lucide React** para ícones

## 📱 Recursos Mobile

- Design responsivo otimizado para mobile
- PWA (Progressive Web App) instalável
- Notificações push nativas
- Interface touch-friendly
- Funciona offline (cache básico)

## 🔧 Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication, Firestore e Cloud Messaging
3. Copie as configurações do projeto
4. Edite `src/config/firebase.ts` com suas credenciais:

```typescript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

### 3. Configurar Google Calendar (Opcional)

1. Ative a Google Calendar API no Google Cloud Console
2. Configure as credenciais OAuth2
3. Adicione o Calendar ID nas configurações do usuário

### 4. Executar o projeto

```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Auth/           # Autenticação
│   └── Dashboard/      # Dashboard principal
├── hooks/              # Hooks personalizados
├── types/              # Tipos TypeScript
├── config/             # Configurações
└── App.tsx             # Componente principal
```

## 🎨 Design System

- **Cores principais**: Barber (laranja) e Primary (azul)
- **Tipografia**: Inter (Google Fonts)
- **Componentes**: Tailwind CSS com classes customizadas
- **Ícones**: Lucide React
- **Animações**: CSS transitions e keyframes

## 📊 Banco de Dados (Firestore)

### Coleções

- **users** - Usuários (barbeiros e clientes)
- **appointments** - Agendamentos
- **services** - Serviços oferecidos
- **settings** - Configurações da barbearia

### Estrutura de Dados

```typescript
// User
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

// Appointment
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

## 🔔 Notificações Push

O sistema suporta notificações push para:
- Lembretes de agendamento
- Confirmações de agendamento
- Cancelamentos
- Novos agendamentos

## 📱 PWA

O app pode ser instalado como PWA:
- Manifest.json configurado
- Service Worker para cache
- Ícones para diferentes tamanhos
- Funciona offline (funcionalidades básicas)

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm run build
# Faça upload da pasta dist/ para Vercel
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🔒 Segurança

- Autenticação Firebase
- Regras de segurança Firestore
- Validação de dados no frontend e backend
- HTTPS obrigatório em produção

## 📈 Próximas Funcionalidades

- [ ] Integração com WhatsApp
- [ ] Sistema de pagamentos
- [ ] Relatórios e analytics
- [ ] Multi-barbearia
- [ ] App mobile nativo
- [ ] Integração com Instagram

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Desenvolvido por

Criado com 💜 para facilitar a gestão de barbearias e proporcionar uma melhor experiência para barbeiros e clientes.

---

**Barber Calendar** - Sua agenda digital! 💇‍♂️✨