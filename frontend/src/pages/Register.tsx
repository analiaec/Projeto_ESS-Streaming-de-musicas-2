import { useState, KeyboardEvent } from 'react';
import { Link, useNavigate }       from 'react-router-dom';
import { registerApi, registerPodcasterApi } from '../api';
import { useToast }                from '../contexts/ToastContext';
import { Navbar }                  from '../components/Navbar';
import './Login.css';
import './Register.css';

const TIPOS = [
  { value: 'OUVINTE',   label: 'Ouvinte',        desc: 'Escuta músicas e podcasts' },
  { value: 'ARTISTA',   label: 'Artista',         desc: 'Publica álbuns e músicas' },
  { value: 'PODCASTER', label: 'Podcaster',       desc: 'Cria e gerencia podcasts' },
];

export function Register() {
  const [login,       setLogin]       = useState('');
  const [name,        setName]        = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [tipodeconta, setTipo]        = useState('OUVINTE');
  const [description, setDescription] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [erro,        setErro]        = useState('');

  const { toast }  = useToast();
  const navigate   = useNavigate();

  async function handleRegister() {
    if (!login.trim() || !name.trim() || !email.trim() || !password.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    if (tipodeconta === 'PODCASTER' && !description.trim()) {
      setErro('A descrição é obrigatória para contas de podcast.');
      return;
    }
    setErro('');
    setLoading(true);
    try {
      if (tipodeconta === 'PODCASTER') {
        await registerPodcasterApi(login, name, password, email, description);
      } else {
        await registerApi(login, name, password, email, tipodeconta);
      }
      toast('Conta criada com sucesso! Faça login para continuar.', 'success');
      navigate('/login');
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erro ao criar conta.';
      setErro(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleRegister();
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="auth-center">
          <div className="auth-card reg-card">
            <div className="auth-header">
              <span className="auth-logo">♪</span>
              <h1 className="auth-title">Criar conta</h1>
              <p className="auth-sub">Junte-se ao .WAVe</p>
            </div>

            <div className="auth-form">
              <div className="reg-row">
                <div className="form-group">
                  <label className="form-label">Login *</label>
                  <input placeholder="seu_login" value={login}
                    onChange={e => setLogin(e.target.value)} onKeyDown={onKey} />
                </div>
                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input placeholder="Seu nome" value={name}
                    onChange={e => setName(e.target.value)} onKeyDown={onKey} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">E-mail *</label>
                <input type="email" placeholder="voce@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} onKeyDown={onKey} />
              </div>

              <div className="form-group">
                <label className="form-label">Senha *</label>
                <div className="input-eye-wrap">
                  <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey} />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de conta *</label>
                <div className="tipo-grid">
                  {TIPOS.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      className={`tipo-btn ${tipodeconta === t.value ? 'selected' : ''}`}
                      onClick={() => setTipo(t.value)}
                    >
                      <span className="tipo-label">{t.label}</span>
                      <span className="tipo-desc">{t.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {(tipodeconta === 'ARTISTA' || tipodeconta === 'PODCASTER') && (
                <div className="form-group">
                  <label className="form-label">
                    Descrição {tipodeconta === 'PODCASTER' ? '*' : '(opcional)'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={tipodeconta === 'PODCASTER'
                      ? 'Sobre seu podcast…'
                      : 'Sobre você como artista…'}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              )}

              {erro && <div className="alert alert-error">{erro}</div>}

              <button className="btn btn-primary auth-submit" onClick={handleRegister} disabled={loading}>
                {loading ? 'Criando conta…' : 'Criar conta'}
              </button>
            </div>

            <p className="auth-footer">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
