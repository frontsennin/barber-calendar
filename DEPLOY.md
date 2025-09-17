# Guia de Deploy - Barber Calendar 🚀

## 📋 Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **Firebase CLI** instalado globalmente
3. **Conta Google** para Firebase
4. **Projeto Firebase** criado

## 🔧 Configuração Inicial

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login no Firebase

```bash
firebase login
```

### 3. Inicializar projeto Firebase

```bash
firebase init
```

Selecione as seguintes opções:
- ✅ Firestore
- ✅ Hosting
- ✅ Functions (opcional)
- ✅ Storage (opcional)

### 4. Configurar variáveis de ambiente

Copie o arquivo `env.example` para `.env` e preencha com suas credenciais:

```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações do Firebase.

## 🏗️ Build do Projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Build para produção

```bash
npm run build:prod
```

## 🔥 Deploy no Firebase

### 1. Deploy do Hosting

```bash
firebase deploy --only hosting
```

### 2. Deploy das regras do Firestore

```bash
firebase deploy --only firestore:rules
```

### 3. Deploy dos índices do Firestore

```bash
firebase deploy --only firestore:indexes
```

### 4. Deploy completo

```bash
firebase deploy
```

## 🌐 Deploy em Outras Plataformas

### Vercel

1. Instale a CLI do Vercel:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Netlify

1. Build do projeto:
```bash
npm run build
```

2. Faça upload da pasta `dist/` para Netlify

### GitHub Pages

1. Instale o gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Adicione ao package.json:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

## 🔐 Configuração de Segurança

### 1. Regras do Firestore

As regras já estão configuradas no arquivo `firestore.rules`. Certifique-se de que estão ativas:

```bash
firebase deploy --only firestore:rules
```

### 2. Configuração de domínio

No Firebase Console:
1. Vá para Authentication > Settings > Authorized domains
2. Adicione seu domínio de produção

### 3. Configuração de CORS

Se necessário, configure CORS para APIs externas.

## 📱 Configuração PWA

### 1. Ícones

Certifique-se de que os ícones estão na pasta `public/`:
- `icon-192.png`
- `icon-512.png`

### 2. Manifest

O arquivo `manifest.json` já está configurado.

### 3. Service Worker

O service worker está em `public/sw.js` e será registrado automaticamente.

## 🔔 Configuração de Notificações

### 1. Firebase Cloud Messaging

1. No Firebase Console, vá para Cloud Messaging
2. Configure o VAPID key
3. Adicione o VAPID key no arquivo `.env`

### 2. Permissões

Certifique-se de que as permissões de notificação estão configuradas no navegador.

## 📊 Monitoramento

### 1. Firebase Analytics

Analytics será ativado automaticamente após o deploy.

### 2. Performance Monitoring

Para monitorar performance, adicione:

```bash
npm install firebase
```

E configure no `firebase.ts`:

```typescript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
```

## 🚨 Troubleshooting

### Erro de Build

```bash
# Limpar cache
npm run clean
rm -rf node_modules
npm install
npm run build
```

### Erro de Deploy

```bash
# Verificar configuração
firebase projects:list
firebase use --add
```

### Erro de Permissões

Verifique se as regras do Firestore estão corretas e se o usuário tem as permissões necessárias.

## 📈 Otimizações

### 1. Bundle Size

O projeto já está configurado com code splitting no `vite.config.ts`.

### 2. Caching

Configure headers de cache no `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### 3. Compressão

A Vercel e Netlify já fazem compressão automática.

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: your-project-id
```

## 📞 Suporte

Para problemas com deploy:

1. Verifique os logs do Firebase: `firebase functions:log`
2. Consulte a documentação oficial do Firebase
3. Verifique as configurações de ambiente

---

**Barber Calendar** - Deploy fácil e rápido! 🚀
