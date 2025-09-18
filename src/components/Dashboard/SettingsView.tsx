import { useState } from 'react';
import { User, Bell, Calendar, Shield, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuthSimple';

export const SettingsView = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'calendar', name: 'Calendário', icon: Calendar },
    { id: 'security', name: 'Segurança', icon: Shield },
  ];

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
      };
      
      await updateUser(updates);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={user?.name || ''}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                className="input-field bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                O email não pode ser alterado
              </p>
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                defaultValue={user?.phone || ''}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de usuário
              </label>
              <input
                type="text"
                id="role"
                value={user?.role === 'barber' ? 'Barbeiro' : 'Cliente'}
                className="input-field bg-gray-100"
                disabled
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        );

      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Lembretes de agendamento</h3>
                <p className="text-sm text-gray-500">
                  Receber notificações antes dos agendamentos
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-barber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-barber-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Confirmações de agendamento</h3>
                <p className="text-sm text-gray-500">
                  Receber confirmações quando agendamentos são criados
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-barber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-barber-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Cancelamentos</h3>
                <p className="text-sm text-gray-500">
                  Receber notificações quando agendamentos são cancelados
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-barber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-barber-600"></div>
              </label>
            </div>
          </div>
        );

      case 'calendar':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="googleCalendar" className="block text-sm font-medium text-gray-700 mb-1">
                Google Calendar ID
              </label>
              <input
                type="text"
                id="googleCalendar"
                placeholder="seu-calendar-id@group.calendar.google.com"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                Para sincronizar com o Google Calendar
              </p>
            </div>
            
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                Fuso horário
              </label>
              <select id="timezone" className="input-field">
                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                <option value="America/New_York">Nova York (GMT-5)</option>
                <option value="Europe/London">Londres (GMT+0)</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-1">
                Horário de funcionamento
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Início</label>
                  <input type="time" defaultValue="08:00" className="input-field" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Fim</label>
                  <input type="time" defaultValue="18:00" className="input-field" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Alterar senha</h3>
              <div className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha atual
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nova senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="input-field"
                  />
                </div>
                <button className="btn-primary">
                  Alterar senha
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-gray-600">Gerencie suas preferências e configurações</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="card p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-barber-100 text-barber-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
