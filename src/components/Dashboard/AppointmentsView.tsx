import { useState } from 'react';
import { Clock, User, Calendar, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '../../hooks/useAppointmentsSimple';
import { useAuth } from '../../hooks/useAuthSimple';
// import { Appointment } from '../../types';

export const AppointmentsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { user } = useAuth();
  const { appointments, loading, updateAppointment } = useAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Agendado';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      case 'no-show':
        return 'Não compareceu';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus as any });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Agendamentos</h2>
        <p className="text-gray-600">Gerencie todos os seus agendamentos</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente ou observações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field pl-10"
              >
                <option value="all">Todos os status</option>
                <option value="pending">Agendado</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
                <option value="no-show">Não compareceu</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="card">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agendamento encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca'
                : 'Você ainda não tem agendamentos'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(appointment.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <User className="w-4 h-4 mr-2" />
                      Cliente: {appointment.clientId}
                    </div>
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-500">{appointment.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                    
                    {user?.role === 'barber' && appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                      <div className="flex gap-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            Confirmar
                          </button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Concluir
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
