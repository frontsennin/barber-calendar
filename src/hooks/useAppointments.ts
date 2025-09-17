import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Appointment, TimeSlot } from '../types';
import { useAuth } from './useAuthSimple';

export const useAppointments = (barberId?: string, date?: Date) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'appointments'),
      orderBy('date', 'asc')
    );

    if (barberId) {
      q = query(
        collection(db, 'appointments'),
        where('barberId', '==', barberId),
        orderBy('date', 'asc')
      );
    } else if (user.role === 'client') {
      q = query(
        collection(db, 'appointments'),
        where('clientId', '==', user.id),
        orderBy('date', 'asc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appointmentsData: Appointment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsData.push({
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Appointment);
      });
      setAppointments(appointmentsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, barberId]);

  const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        date: Timestamp.fromDate(appointmentData.date),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  };

  const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
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
