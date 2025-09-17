import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Configuração do Firebase - suas credenciais
const firebaseConfig = {
  apiKey: "AIzaSyDelb4AZpiwNYE8FeTtlL9AZ32hONScGNA",
  authDomain: "barber-calendar-bdcee.firebaseapp.com",
  projectId: "barber-calendar-bdcee",
  storageBucket: "barber-calendar-bdcee.firebasestorage.app",
  messagingSenderId: "998759500340",
  appId: "1:998759500340:web:f7a69f3781d0e38105d861",
  measurementId: "G-7WR1WVK68X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Configuração de notificações push
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'seu-vapid-key-aqui'
      });
      console.log('Token de notificação:', token);
      return token;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
  }
  return null;
};

// Listener para mensagens em foreground
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export default app;
