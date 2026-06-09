import { useEffect, useState } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import { getUserApi }          from '../api';
import { useAuth }             from '../contexts/AuthContext';
import { Navbar }              from '../components/Navbar';
import './AccountSettings.css';

const ROLE_LABEL: Record<string, string> = {
  OUVINTE:   'Ouvinte',
  ARTISTA:   'Artista',
  PODCASTER: 'Podcaster',
  ADMIN:     'Administrador',
};

export function AccountSettings() {
  const { login, token, logado, sair } = useAuth();
  const navigate = useNavigate();
  const [user,       setUser]       = useState<any | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!logado || !login || !token) { navigate('/login'); return; }
    getUserApi(login, token)
      .then(setUser)
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, [login, token, logado, navigate]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>👤 Minha Conta</h1>

          {carregando && <div className="loader-wrap"><span className="loader" /></div>}

          {!carregando && user && (
            <div className="acc-card card">
              <div className="acc-field">
                <span className="acc-label">Login</span>
                <span className="acc-value">{user.login}</span>
              </div>
              <div className="acc-field">
                <span className="acc-label">Nome</span>
                <span className="acc-value">{user.name}</span>
              </div>
              <div className="acc-field">
                <span className="acc-label">E-mail</span>
                <span className="acc-value">{user.email}</span>
              </div>
              <div className="acc-field">
                <span className="acc-label">Tipo de conta</span>
                <span className="acc-value">
                  <span className="badge badge-accent">
                    {ROLE_LABEL[user.tipodeconta] ?? user.tipodeconta}
                  </span>
                </span>
              </div>

              <div className="acc-actions">
                <Link to="/update-account" className="btn btn-primary btn-sm">
                  Editar dados
                </Link>
                <Link to="/remove-account" className="btn btn-danger btn-sm">
                  Excluir conta
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
