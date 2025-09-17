import { AuthProvider, useAuth } from './hooks/useAuthSimple';
import { AuthPage } from './components/Auth/AuthPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PublicBooking } from './components/Public/PublicBooking';

const AppContent = () => {
  const { user, loading } = useAuth();

  // Verificar se é uma rota pública (agendamento)
  const isPublicRoute = window.location.pathname === '/agendar' || window.location.pathname === '/booking';

  if (isPublicRoute) {
    return <PublicBooking />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-barber-50 to-barber-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
