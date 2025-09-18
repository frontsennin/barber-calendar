import { useState, useEffect } from 'react';
import { useAuth } from './useAuthSimple';
import { Appointment, TimeSlot } from '../types';

export const useAppointments = (barberId?: string) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Dados mock para teste
  useEffect(() => {
    // Para agendamento público, não precisa de usuário logado
    if (!user && !barberId) {
      setLoading(false);
      return;
    }

    // Simular alguns agendamentos para teste
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        clientId: user?.id || 'mock-client-1',
        clientName: user?.name || 'Cliente Teste',
        clientPhone: user?.phone || '(11) 99999-9999',
        clientEmail: user?.email || '',
        barberId: 'barber1',
        barberName: 'João Barbearia',
        service: 'Corte + Barba',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
        startTime: '14:00',
        endTime: '15:00',
        duration: 60,
        price: 40,
        status: 'confirmed',
        notes: 'Primeiro agendamento',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        clientId: user?.id || 'mock-client-1',
        clientName: user?.name || 'Cliente Teste',
        clientPhone: user?.phone || '(11) 99999-9999',
        clientEmail: user?.email || '',
        barberId: 'barber1',
        barberName: 'João Barbearia',
        service: 'Corte',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Próxima semana
        startTime: '10:00',
        endTime: '10:30',
        duration: 30,
        price: 25,
        status: 'pending',
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    setAppointments(mockAppointments);
    setLoading(false);
  }, [user]);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Simular criação de agendamento
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `appointment-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment.id;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  };

  const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === appointmentId 
            ? { ...appointment, ...updates, updatedAt: new Date() }
            : appointment
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      throw error;
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      await updateAppointment(appointmentId, { status: 'cancelled' });
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      throw error;
    }
  };

  const getTimeSlots = (date: Date, barberId: string, serviceDuration: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8; // 8:00
    const endHour = 18; // 18:00
    const slotDuration = 30; // 30 minutos

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const slotDate = new Date(date);
        slotDate.setHours(hour, minutes, 0, 0);

        // Verificar se há conflito com agendamentos existentes
        const hasConflict = appointments.some(appointment => {
          if (appointment.barberId !== barberId) return false;
          if (appointment.status === 'cancelled') return false;
          
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(
            parseInt(appointment.startTime.split(':')[0]),
            parseInt(appointment.startTime.split(':')[1])
          );
          
          const appointmentEndDate = new Date(appointmentDate);
          appointmentEndDate.setMinutes(appointmentEndDate.getMinutes() + serviceDuration);
          
          return slotDate < appointmentEndDate && slotDate >= appointmentDate;
        });

        slots.push({
          time,
          available: !hasConflict,
          appointmentId: hasConflict ? appointments.find(appointment => {
            const appointmentDate = new Date(appointment.date);
            appointmentDate.setHours(
              parseInt(appointment.startTime.split(':')[0]),
              parseInt(appointment.startTime.split(':')[1])
            );
            return slotDate >= appointmentDate && slotDate < new Date(appointmentDate.getTime() + serviceDuration * 60000);
          })?.id : undefined
        });
      }
    }

    return slots;
  };

  return {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getTimeSlots,
  };
};
