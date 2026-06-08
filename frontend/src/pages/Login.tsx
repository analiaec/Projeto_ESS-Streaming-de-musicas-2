import { useState, KeyboardEvent } from 'react';
import { Link, useNavigate }       from 'react-router-dom';
import { loginApi }                from '../api';
import { useAuth }                 from '../contexts/AuthContext';
import { useToast }                from '../contexts/ToastContext';
import { Navbar }                  from '../components/Navbar';
import './Login.css';

export function Login() {
  const [login,    setLogin]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [erro,     setErro]     = useState('');

  const { entrar }  = useAuth();
  const { toast }   = useToast();
  const navigate    = useNavigate();

  async function handleLogin() {
    if (!login.trim() || !password.trim()) {
      setErro('Preencha login e senha.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      const dados = await loginApi(login, password);
      entrar(login, dados.access_token, dados.role);
      toast(`Bem-vindo de volta, ${login}!`, 'success');
      navigate('/');
    } catch {
      setErro('Login ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleLogin();
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="auth-center">
          <div className="auth-card">
            <div className="auth-header">
              <span className="auth-logo">♪</span>
              <h1 className="auth-title">Entrar no .WAVe</h1>
              <p className="auth-sub">Sua plataforma de streaming</p>
            </div>

            <div className="auth-form">
              <div className="form-group">
                <label className="form-label">Login</label>
                <input
                  type="text"
                  placeholder="seu_login"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  onKeyDown={onKey}
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha</label>
                <div className="input-eye-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={onKey}
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPass(p => !p)}
                    tabIndex={-1}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              {erro && <div className="alert alert-error">{erro}</div>}

              <button
                className="btn btn-primary auth-submit"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Entrando…' : 'Entrar'}
              </button>
            </div>

            <p className="auth-footer">
              Não tem conta?{' '}
              <Link to="/auth/register">Criar conta</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
