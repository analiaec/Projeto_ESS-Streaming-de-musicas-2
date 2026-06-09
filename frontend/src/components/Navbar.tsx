import { Link, useLocation } from 'react-router-dom';
import { useAuth }            from '../contexts/AuthContext';
import { useTheme }           from '../contexts/ThemeContext';
import './Navbar.css';

export function Navbar() {
  const { login, logado, role, sair } = useAuth();
  const { theme, toggleTheme }        = useTheme();
  const { pathname }                  = useLocation();

  function active(path: string) {
    return pathname === path || pathname.startsWith(path + '/') ? 'nav-link active' : 'nav-link';
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-logo">♪</span>
          <span className="navbar-name">.WAVe</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/em-alta"   className={active('/em-alta')}>Em Alta</Link>
          <Link to="/busca"     className={active('/busca')}>Busca</Link>
          <Link to="/podcasts"  className={active('/podcasts')}>Podcasts</Link>
          {logado && <Link to="/historico"    className={active('/historico')}>Histórico</Link>}
          {logado && <Link to="/recomendacoes" className={active('/recomendacoes')}>Para Você</Link>}
          {logado && <Link to="/playlists"    className={active('/playlists')}>Playlists</Link>}
          {logado && <Link to="/albuns"       className={active('/albuns')}>Álbuns</Link>}
          {role === 'PODCASTER' && <Link to="/meu-podcast" className={active('/meu-podcast')}>Meu Podcast</Link>}
          {role === 'ADMIN'     && <Link to="/admin/users" className={active('/admin/users')}>Admin</Link>}
        </nav>

        <div className="navbar-auth">
          <button
            className="navbar-theme-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {logado ? (
            <>
              <span className="navbar-user">
                <span className="navbar-avatar">{login?.charAt(0).toUpperCase()}</span>
                {login}
              </span>
              <button className="navbar-logout" onClick={sair}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login"         className="btn btn-ghost btn-sm">Entrar</Link>
              <Link to="/auth/register" className="btn btn-primary btn-sm">Criar conta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
