import { Link }    from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar }  from '../components/Navbar';
import './Home.css';

const CARDS_PUBLIC = [
  { to: '/em-alta',  icon: '🔥', label: 'Em Alta',       desc: 'As músicas mais ouvidas agora' },
  { to: '/busca',    icon: '🔍', label: 'Buscar',         desc: 'Encontre músicas e artistas' },
  { to: '/podcasts', icon: '🎙', label: 'Podcasts',       desc: 'Ouça seus podcasts favoritos' },
];

const CARDS_LOGADO = [
  { to: '/recomendacoes', icon: '✨', label: 'Para Você',  desc: 'Recomendações personalizadas' },
  { to: '/playlists',     icon: '📋', label: 'Playlists',  desc: 'Organize suas músicas' },
  { to: '/historico',     icon: '🕗', label: 'Histórico',  desc: 'Músicas que você ouviu' },
];

export function Home() {
  const { login, logado, role } = useAuth();

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <div className="home-hero">
            <h1 className="home-hero-title">
              {logado ? `Olá, ${login}!` : 'Bem-vindo ao .WAVe'}
            </h1>
            <p className="home-hero-sub">
              {logado
                ? 'O que vamos ouvir hoje?'
                : 'Sua plataforma de streaming de músicas e podcasts.'}
            </p>
            {!logado && (
              <div className="home-hero-actions">
                <Link to="/auth/register" className="btn btn-primary">Criar conta</Link>
                <Link to="/login" className="btn btn-ghost">Entrar</Link>
              </div>
            )}
          </div>

          <div className="home-section">
            <h2 className="section-title">Explorar</h2>
            <div className="home-grid">
              {CARDS_PUBLIC.map(c => (
                <Link key={c.to} to={c.to} className="home-card">
                  <span className="home-card-icon">{c.icon}</span>
                  <span className="home-card-label">{c.label}</span>
                  <span className="home-card-desc">{c.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          {logado && (
            <div className="home-section">
              <h2 className="section-title">Sua biblioteca</h2>
              <div className="home-grid">
                {CARDS_LOGADO.map(c => (
                  <Link key={c.to} to={c.to} className="home-card">
                    <span className="home-card-icon">{c.icon}</span>
                    <span className="home-card-label">{c.label}</span>
                    <span className="home-card-desc">{c.desc}</span>
                  </Link>
                ))}
                {role === 'PODCASTER' && (
                  <Link to="/meu-podcast" className="home-card home-card-accent">
                    <span className="home-card-icon">🎙</span>
                    <span className="home-card-label">Meu Podcast</span>
                    <span className="home-card-desc">Gerenciar episódios e estatísticas</span>
                  </Link>
                )}
                {role === 'ADMIN' && (
                  <Link to="/admin/users" className="home-card">
                    <span className="home-card-icon">⚙️</span>
                    <span className="home-card-label">Admin</span>
                    <span className="home-card-desc">Gerenciar usuários da plataforma</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
