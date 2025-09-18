import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('barber-calendar-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('barber-calendar-user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // Simulação de login (substitua pela integração real do Firebase)
    const mockUser: User = {
      id: 'mock-user-id',
      email: email,
      name: 'Usuário Teste',
      phone: '(11) 99999-9999',
      role: 'barber',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem('barber-calendar-user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  const signUp = async (email: string, _password: string, userData: Partial<User>) => {
    // Simulação de cadastro
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email,
      name: userData.name || '',
      phone: userData.phone || '',
      role: userData.role || 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    localStorage.setItem('barber-calendar-user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    localStorage.removeItem('barber-calendar-user');
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date() };
    localStorage.setItem('barber-calendar-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
