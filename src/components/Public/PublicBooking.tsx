import { useState } from 'react';
import { Calendar, Clock, User, Scissors, CheckCircle } from 'lucide-react';
import { format, addDays, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { usePublicAppointments } from '../../hooks/usePublicAppointments';
import { Service } from '../../types';

const services: Service[] = [
  { id: '1', name: 'Corte', duration: 30, price: 25, barberId: 'barber1' },
  { id: '2', name: 'Barba', duration: 30, price: 20, barberId: 'barber1' },
  { id: '3', name: 'Corte + Barba', duration: 60, price: 40, barberId: 'barber1' },
  { id: '4', name: 'Sobrancelha', duration: 15, price: 15, barberId: 'barber1' },
];

const barberInfo = {
  id: 'barber1',
  name: 'João Barbearia',
  phone: '(11) 99999-9999',
  address: 'Rua das Flores, 123 - Centro',
  workingHours: {
    start: 8,
    end: 18,
    days: [1, 2, 3, 4, 5, 6] // Segunda a Sábado
  }
};

export const PublicBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<Service>(services[0]);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [step, setStep] = useState<'date' | 'time' | 'service' | 'client' | 'confirm'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { createAppointment, getTimeSlots } = usePublicAppointments();

  // Gerar próximos 30 dias disponíveis
  const getAvailableDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Verificar se é um dia de trabalho
      if (barberInfo.workingHours.days.includes(dayOfWeek)) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots(selectedDate, barberInfo.id, selectedService.duration);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('service');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('client');
  };

  const handleClientInfoChange = (field: string, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!clientInfo.name || !clientInfo.phone) {
      alert('Por favor, preencha pelo menos nome e telefone');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);

      const appointmentData = {
        clientId: `client-${Date.now()}`, // ID temporário
        clientName: clientInfo.name,
        clientPhone: clientInfo.phone,
        clientEmail: clientInfo.email,
        barberId: barberInfo.id,
        barberName: barberInfo.name,
        service: selectedService.name,
        date: appointmentDate,
        startTime: selectedTime,
        endTime: format(new Date(appointmentDate.getTime() + selectedService.duration * 60000), 'HH:mm'),
        duration: selectedService.duration,
        price: selectedService.price,
        status: 'pending' as const,
        notes: '',
      };

      await createAppointment(appointmentData);
      setIsSuccess(true);
      setStep('confirm');
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert('Erro ao criar agendamento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-barber-50 to-barber-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-left">
            <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Detalhes do Agendamento:</h3>
            <div className="text-xs sm:text-sm space-y-1">
              <p><strong>Serviço:</strong> {selectedService.name}</p>
              <p><strong>Data:</strong> {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
              <p><strong>Horário:</strong> {selectedTime}</p>
              <p><strong>Valor:</strong> R$ {selectedService.price}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary w-full mt-4 sm:mt-6"
          >
            Fazer Novo Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-barber-50 to-barber-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-3 sm:mb-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{barberInfo.name}</h1>
              <p className="text-sm sm:text-base text-gray-600">{barberInfo.address}</p>
              <p className="text-sm sm:text-base text-gray-600">{barberInfo.phone}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-gray-500">Agende seu horário</p>
              <p className="text-xs sm:text-sm text-gray-500">Segunda a Sábado: 8h às 18h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
          {['date', 'time', 'service', 'client', 'confirm'].map((stepName, index) => (
            <div key={stepName} className="flex items-center">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                step === stepName ? 'bg-barber-500 text-white' :
                ['date', 'time', 'service', 'client', 'confirm'].indexOf(step) > index ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                  ['date', 'time', 'service', 'client', 'confirm'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          {step === 'date' && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Escolha a Data
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {availableDates.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => handleDateSelect(date)}
                    className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-colors ${
                      isSameDay(date, selectedDate)
                        ? 'border-barber-500 bg-barber-50 text-barber-700'
                        : 'border-gray-200 hover:border-barber-300 hover:bg-barber-50'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-medium">
                      {format(date, 'dd/MM', { locale: ptBR })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(date, 'EEE', { locale: ptBR })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'time' && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-sm sm:text-base">Escolha o Horário - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-colors text-xs sm:text-sm ${
                      !slot.available
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : slot.time === selectedTime
                        ? 'border-barber-500 bg-barber-50 text-barber-700'
                        : 'border-gray-200 hover:border-barber-300 hover:bg-barber-50'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('date')}
                className="btn-secondary mt-4 sm:mt-6 w-full sm:w-auto"
              >
                Voltar
              </button>
            </div>
          )}

          {step === 'service' && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <Scissors className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Escolha o Serviço
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedService.id === service.id
                        ? 'border-barber-500 bg-barber-50'
                        : 'border-gray-200 hover:border-barber-300 hover:bg-barber-50'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm sm:text-base">{service.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {service.duration} min • R$ {service.price}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep('time')}
                className="btn-secondary mt-4 sm:mt-6 w-full sm:w-auto"
              >
                Voltar
              </button>
            </div>
          )}

          {step === 'client' && (
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Seus Dados
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={(e) => handleClientInfoChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={clientInfo.phone}
                    onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                    className="input-field"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => handleClientInfoChange('email', e.target.value)}
                    className="input-field"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Resumo do Agendamento:</h3>
                <div className="text-xs sm:text-sm space-y-1">
                  <p><strong>Serviço:</strong> {selectedService.name}</p>
                  <p><strong>Data:</strong> {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Valor:</strong> R$ {selectedService.price}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
                <button
                  onClick={() => setStep('service')}
                  className="btn-secondary flex-1"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !clientInfo.name || !clientInfo.phone}
                  className="btn-primary flex-1"
                >
                  {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
