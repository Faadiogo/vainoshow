import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface ExtendedUser {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loginWithSocial: (provider: 'google') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string): Promise<ExtendedUser | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }

    return data;
  };

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) setUser(profile);
      }
      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      toast({ title: 'Erro ao entrar', description: error?.message || '', variant: 'destructive' });
      setLoading(false);
      return false;
    }

    const profile = await fetchProfile(data.user.id);
    if (profile) setUser(profile);
    setLoading(false);
    toast({ title: 'Login realizado com sucesso' });
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error || !data.user) {
        toast({ title: 'Erro no cadastro', description: error?.message || '', variant: 'destructive' });
        setLoading(false);
        return false;
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, email, name, is_admin: false });

      if (insertError) {
        toast({ title: 'Erro ao salvar perfil', description: insertError.message, variant: 'destructive' });
        setLoading(false);
        return false;
      }

      const profile = await fetchProfile(data.user.id);
      if (profile) setUser(profile);

      toast({ title: 'Conta criada com sucesso', description: 'Bem-vindo(a) ao vainoshow!' });
      return true;
    } catch (err) {
      toast({ title: 'Erro no cadastro', description: 'Erro inesperado', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast({ title: 'Logout realizado com sucesso' });
  };

  const loginWithSocial = (provider: 'google') => {
    supabase.auth.signInWithOAuth({ provider });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithSocial }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
