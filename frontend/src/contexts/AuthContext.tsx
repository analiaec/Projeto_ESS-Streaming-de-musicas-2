import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  login:     string | null;
  token:     string | null;
  role: string | null;
  entrar:    (login: string, token: string, role: string) => void;
  sair:      () => void;
  logado:    boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [login, setLogin] = useState<string | null>(() => localStorage.getItem('wv_login'));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('wv_token'));
  const [role,  setRole]  = useState<string | null>(() => localStorage.getItem('wv_role'));

  function entrar(login: string, token: string, role: string) {
    localStorage.setItem('wv_login', login);
    localStorage.setItem('wv_token', token);
    localStorage.setItem('wv_role',  role);
    setLogin(login);
    setToken(token);
    setRole(role);
  }

  function sair() {
    localStorage.removeItem('wv_login');
    localStorage.removeItem('wv_token');
    localStorage.removeItem('wv_role');
    setLogin(null);
    setToken(null);
    setRole(null);
  }

  return (
    <AuthContext.Provider value={{
      login,
      token,
      role,
      entrar,
      sair,
      logado: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}