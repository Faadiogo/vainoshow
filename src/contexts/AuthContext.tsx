
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithSocial: (provider: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock de dados para demonstração
const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@vainoshow.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    isAdmin: false,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const storedUser = localStorage.getItem('vainoshow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulação de login
      const foundUser = MOCK_USERS.find(
        u => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remova a senha antes de salvar o usuário
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('vainoshow_user', JSON.stringify(userWithoutPassword));
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo(a) de volta, ${foundUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Falha no login",
          description: "Email ou senha incorretos.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithSocial = async (provider: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulação de login social
      const mockSocialUser = {
        id: '3',
        name: `Usuário ${provider}`,
        email: `user_${provider.toLowerCase()}@example.com`,
        image: 'https://api.dicebear.com/7.x/micah/svg?seed=Felix',
        isAdmin: false,
      };
      
      setUser(mockSocialUser);
      localStorage.setItem('vainoshow_user', JSON.stringify(mockSocialUser));
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) ${mockSocialUser.name}!`,
      });
      return true;
    } catch (error) {
      console.error('Erro no login social:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro com o login social. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Verificar se o email já está em uso
      if (MOCK_USERS.some(u => u.email === email)) {
        toast({
          title: "Falha no cadastro",
          description: "Este email já está em uso.",
          variant: "destructive",
        });
        return false;
      }
      
      // Simulação de registro
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        isAdmin: false,
      };
      
      setUser(newUser);
      localStorage.setItem('vainoshow_user', JSON.stringify(newUser));
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo(a) ao vainoshow!",
      });
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vainoshow_user');
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithSocial,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
