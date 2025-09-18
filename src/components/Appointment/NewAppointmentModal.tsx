import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Calendar, Clock, User, Scissors } from 'lucide-react';
import { useAppointments } from '../../hooks/useAppointmentsSimple';
import { useAuth } from '../../hooks/useAuthSimple';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { Appointment, Service } from '../../types';
import { format, addMinutes } from 'date-fns';

const schema = yup.object({
  clientId: yup.string().required('Cliente é obrigatório'),
  serviceId: yup.string().required('Serviço é obrigatório'),
  date: yup.date().required('Data é obrigatória'),
  startTime: yup.string().required('Horário é obrigatório'),
  notes: yup.string(),
});

// type NewAppointmentFormData = yup.InferType<typeof schema>;

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export const NewAppointmentModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedTime 
}: NewAppointmentModalProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const { createAppointment } = useAppointments();
  const { createEvent, isSignedIn } = useGoogleCalendar();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: selectedDate,
      startTime: selectedTime,
    },
  });

  const selectedService = services.find(service => service.id === watch('serviceId'));
  const selectedDateValue = watch('date');
  const selectedStartTime = watch('startTime');

  useEffect(() => {
    if (selectedDate) {
      setValue('date', selectedDate);
    }
    if (selectedTime) {
      setValue('startTime', selectedTime);
    }
  }, [selectedDate, selectedTime, setValue]);

  useEffect(() => {
    // Carregar serviços e clientes
    // Aqui você implementaria a lógica para buscar do Firebase
    setServices([
      { id: '1', name: 'Corte', duration: 30, price: 25, barberId: user?.id || '' },
      { id: '2', name: 'Barba', duration: 20, price: 15, barberId: user?.id || '' },
      { id: '3', name: 'Corte + Barba', duration: 45, price: 35, barberId: user?.id || '' },
    ]);
    
    setClients([
      { id: '1', name: 'João Silva', email: 'joao@email.com' },
      { id: '2', name: 'Maria Santos', email: 'maria@email.com' },
      { id: '3', name: 'Pedro Costa', email: 'pedro@email.com' },
    ]);
  }, [user]);

  const onSubmit = async (data: any) => {
    if (!user || !selectedService) return;

    setIsLoading(true);
    setError('');

    try {
      const startDateTime = new Date(data.date);
      const [hours, minutes] = data.startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);

      const endDateTime = addMinutes(startDateTime, selectedService.duration);

      const appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
        clientId: data.clientId,
        clientName: 'Cliente',
        clientPhone: '(11) 99999-9999',
        barberId: user.id,
        barberName: user.name || 'Barbeiro',
        service: 'Serviço',
        serviceId: data.serviceId,
        date: startDateTime,
        startTime: data.startTime,
        endTime: format(endDateTime, 'HH:mm'),
        duration: 30,
        price: 25,
        status: 'pending',
        notes: data.notes,
      };

      await createAppointment(appointmentData);

      // Criar evento no Google Calendar se estiver conectado
      if (isSignedIn) {
        try {
          const googleEvent = {
            summary: `${selectedService.name} - ${clients.find(c => c.id === data.clientId)?.name}`,
            description: data.notes || `Agendamento para ${selectedService.name}`,
            start: {
              dateTime: startDateTime.toISOString(),
              timeZone: 'America/Sao_Paulo',
            },
            end: {
              dateTime: endDateTime.toISOString(),
              timeZone: 'America/Sao_Paulo',
            },
          };

          await createEvent(googleEvent);
        } catch (googleError) {
          console.warn('Erro ao criar evento no Google Calendar:', googleError);
        }
      }

      onClose();
    } catch (error: any) {
      setError(error.message || 'Erro ao criar agendamento');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Novo Agendamento</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      {...register('clientId')}
                      className="input-field pl-10"
                    >
                      <option value="">Selecione um cliente</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.clientId && (
                    <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
                  )}
                </div>

                {/* Serviço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serviço
                  </label>
                  <div className="relative">
                    <Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      {...register('serviceId')}
                      className="input-field pl-10"
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - R$ {service.price} ({service.duration}min)
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.serviceId && (
                    <p className="mt-1 text-sm text-red-600">{errors.serviceId.message}</p>
                  )}
                </div>

                {/* Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('date')}
                      type="date"
                      className="input-field pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                {/* Horário */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horário
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('startTime')}
                      type="time"
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                  )}
                </div>

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="input-field"
                    placeholder="Observações adicionais..."
                  />
                </div>

                {selectedService && selectedDateValue && selectedStartTime && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Resumo do Agendamento</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Serviço:</strong> {selectedService.name}</p>
                      <p><strong>Duração:</strong> {selectedService.duration} minutos</p>
                      <p><strong>Preço:</strong> R$ {selectedService.price}</p>
                      <p><strong>Data:</strong> {format(new Date(selectedDateValue), 'dd/MM/yyyy')}</p>
                      <p><strong>Horário:</strong> {selectedStartTime} - {format(addMinutes(new Date(`2000-01-01T${selectedStartTime}`), selectedService.duration), 'HH:mm')}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full sm:w-auto sm:ml-3"
              >
                {isLoading ? 'Criando...' : 'Criar Agendamento'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
