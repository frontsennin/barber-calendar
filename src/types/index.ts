export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'barber' | 'client';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends User {
  role: 'client';
  preferences: {
    preferredBarber?: string;
    services: string[];
    notes?: string;
  };
  history: Appointment[];
}

export interface Barber extends User {
  role: 'barber';
  specialties: string[];
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  duration: number; // em minutos
  price: number;
  description?: string;
  barberId: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  barberId: string;
  barberName: string;
  service: string;
  serviceId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  clientNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  googleEventId?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface CalendarDay {
  date: Date;
  appointments: Appointment[];
  isToday: boolean;
  isPast: boolean;
}

export interface NotificationData {
  title: string;
  body: string;
  type: 'appointment_reminder' | 'appointment_confirmed' | 'appointment_cancelled' | 'new_appointment';
  appointmentId?: string;
  userId: string;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export interface BarberShopSettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  timeSlotDuration: number; // em minutos
  advanceBookingDays: number;
  cancellationPolicy: string;
  googleCalendarId?: string;
}
