import { useState } from 'react';
import { GoogleCalendarEvent } from '../types';

// Declaração global para Google API
declare global {
  interface Window {
    gapi: any;
  }
}

export const useGoogleCalendar = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const loadGoogleAPI = async () => {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CALENDAR_CLIENT_ID,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: 'https://www.googleapis.com/auth/calendar'
          }).then(() => {
            setIsLoaded(true);
            setIsSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
            resolve(true);
          }).catch(reject);
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const signIn = async () => {
    if (!isLoaded) {
      await loadGoogleAPI();
    }

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      setIsSignedIn(true);
      return true;
    } catch (error) {
      console.error('Erro ao fazer login no Google:', error);
      return false;
    }
  };

  const signOut = async () => {
    if (!isLoaded) return;

    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      setIsSignedIn(false);
    } catch (error) {
      console.error('Erro ao fazer logout do Google:', error);
    }
  };

  const createEvent = async (event: GoogleCalendarEvent, calendarId: string = 'primary') => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Google Calendar não está carregado ou usuário não está logado');
    }

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId,
        resource: event
      });

      return response.result;
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      throw error;
    }
  };

  const updateEvent = async (eventId: string, event: GoogleCalendarEvent, calendarId: string = 'primary') => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Google Calendar não está carregado ou usuário não está logado');
    }

    try {
      const response = await window.gapi.client.calendar.events.update({
        calendarId,
        eventId,
        resource: event
      });

      return response.result;
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string, calendarId: string = 'primary') => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Google Calendar não está carregado ou usuário não está logado');
    }

    try {
      await window.gapi.client.calendar.events.delete({
        calendarId,
        eventId
      });

      return true;
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      throw error;
    }
  };

  const getEvents = async (calendarId: string = 'primary', timeMin?: string, timeMax?: string) => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Google Calendar não está carregado ou usuário não está logado');
    }

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items;
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      throw error;
    }
  };

  const getCalendars = async () => {
    if (!isLoaded || !isSignedIn) {
      throw new Error('Google Calendar não está carregado ou usuário não está logado');
    }

    try {
      const response = await window.gapi.client.calendar.calendarList.list();
      return response.result.items;
    } catch (error) {
      console.error('Erro ao buscar calendários:', error);
      throw error;
    }
  };

  return {
    isLoaded,
    isSignedIn,
    loadGoogleAPI,
    signIn,
    signOut,
    createEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getCalendars,
  };
};
