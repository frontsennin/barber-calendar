# 🔥 Firebase - Solução de Problemas

## ❌ **Erro: CONFIGURATION_NOT_FOUND**

### **Causa:**
O Firebase Authentication não está configurado no console.

### **Solução:**

#### **1. Acesse o Firebase Console**
- URL: https://console.firebase.google.com/project/barber-calendar-bdcee

#### **2. Ative Authentication**
1. Clique em **"Authentication"** no menu lateral
2. Se for a primeira vez, clique em **"Get started"**
3. Vá para a aba **"Sign-in method"**

#### **3. Configure Email/Password**
1. Clique em **"Email/Password"**
2. Ative a primeira opção: **"Email/Password"**
3. Clique em **"Save"**

#### **4. Configure Domínios Autorizados**
1. Na aba **"Settings"** do Authentication
2. Em **"Authorized domains"**
3. Adicione: `localhost`
4. Adicione seu domínio de produção

## 🧪 **Teste Rápido**

### **Opção 1: Teste no Console**
1. Acesse: https://console.firebase.google.com/project/barber-calendar-bdcee/authentication
2. Vá para **"Users"**
3. Clique em **"Add user"**
4. Crie um usuário de teste

### **Opção 2: Teste no Código**
1. Adicione o componente `FirebaseTest` temporariamente
2. Teste cadastro e login
3. Verifique se funciona

## 🔧 **Configurações Adicionais**

### **Firestore Database**
1. Acesse: https://console.firebase.google.com/project/barber-calendar-bdcee/firestore
2. Clique em **"Create database"**
3. Escolha **"Start in production mode"**
4. Escolha uma localização (ex: us-central1)

### **Regras de Segurança**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚨 **Outros Erros Comuns**

### **Erro: "Firebase: Error (auth/email-already-in-use)"**
- **Causa:** Email já está cadastrado
- **Solução:** Use outro email ou faça login

### **Erro: "Firebase: Error (auth/weak-password)"**
- **Causa:** Senha muito fraca
- **Solução:** Use senha com pelo menos 6 caracteres

### **Erro: "Firebase: Error (auth/invalid-email)"**
- **Causa:** Email inválido
- **Solução:** Verifique o formato do email

### **Erro: "Firebase: Error (auth/user-not-found)"**
- **Causa:** Usuário não existe
- **Solução:** Cadastre o usuário primeiro

## 📱 **Teste Completo**

### **1. Verificar Configuração**
```bash
# Verificar se o projeto está funcionando
curl -s http://localhost:3000 | head -n 3
```

### **2. Testar Authentication**
1. Acesse: http://localhost:3000
2. Clique em **"Cadastre-se"**
3. Preencha os dados
4. Tente fazer login

### **3. Verificar Console**
- Abra F12 > Console
- Verifique se há erros
- Teste as funcionalidades

## 🔄 **Fallback (Se necessário)**

Se o Firebase não funcionar, use o sistema de fallback:

```typescript
// Substitua no App.tsx
import { AuthProvider } from './hooks/useAuthFallback';
```

## 📞 **Suporte**

### **Firebase Console**
- https://console.firebase.google.com/project/barber-calendar-bdcee

### **Documentação**
- https://firebase.google.com/docs/auth/web/start

### **Status do Firebase**
- https://status.firebase.google.com/

## ✅ **Checklist de Configuração**

- [ ] Authentication ativado
- [ ] Email/Password habilitado
- [ ] Domínios autorizados configurados
- [ ] Firestore criado
- [ ] Regras de segurança configuradas
- [ ] Teste de cadastro funcionando
- [ ] Teste de login funcionando

## 🎯 **Próximos Passos**

1. **Configure Authentication** no Firebase Console
2. **Teste o sistema** de cadastro/login
3. **Configure Firestore** se necessário
4. **Teste todas as funcionalidades**

**Meleth nin, siga esses passos e o Firebase funcionará perfeitamente!** 💜✨
