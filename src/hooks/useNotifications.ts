import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../config/firebase';
// import { NotificationData } from '../types';

export const useNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Solicitar permissão e obter token
    const requestPermission = async () => {
      if (isSupported && permission === 'default') {
        const notificationToken = await requestNotificationPermission();
        if (notificationToken) {
          setToken(notificationToken);
          setPermission('granted');
        }
      }
    };

    requestPermission();
  }, [isSupported, permission]);

  useEffect(() => {
    // Listener para mensagens em foreground
    if (isSupported && permission === 'granted') {
      onMessageListener().then((payload: any) => {
        console.log('Mensagem recebida:', payload);
        
        // Mostrar notificação personalizada
        if (payload.notification) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: payload.data?.appointmentId || 'barber-calendar',
            data: payload.data,
          });
        }
      });
    }
  }, [isSupported, permission]);

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    try {
      const notificationToken = await requestNotificationPermission();
      if (notificationToken) {
        setToken(notificationToken);
        setPermission('granted');
        return true;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
    
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        ...options,
      });
    }
  };

  const scheduleNotification = (title: string, body: string, delay: number) => {
    if (permission === 'granted') {
      setTimeout(() => {
        showNotification(title, { body });
      }, delay);
    }
  };

  return {
    isSupported,
    permission,
    token,
    requestPermission,
    showNotification,
    scheduleNotification,
  };
};
