import { useState } from 'react';
import { Scissors } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-barber-50 to-barber-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-barber-500 rounded-full mb-4">
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Barber Calendar</h1>
          <p className="text-gray-600">Sua agenda digital</p>
        </div>

        {/* Form */}
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">Recursos disponíveis:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 shadow-sm">
              📱 Mobile
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 shadow-sm">
              📅 Google Calendar
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 shadow-sm">
              🔔 Notificações
            </span>
            <span className="px-3 py-1 bg-white rounded-full text-xs text-gray-600 shadow-sm">
              👥 Histórico
            </span>
          </div>
          
          {/* Link para agendamento público */}
          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <p className="text-sm text-gray-600 mb-2">Cliente? Agende seu horário:</p>
            <a
              href="/agendar"
              className="inline-flex items-center px-4 py-2 bg-barber-500 text-white rounded-lg hover:bg-barber-600 transition-colors text-sm font-medium"
            >
              📅 Agendar Horário
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
