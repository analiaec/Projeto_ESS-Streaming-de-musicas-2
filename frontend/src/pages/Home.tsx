import { Link }    from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

export function Home() {
  const { login, logado, role, sair } = useAuth();

  return (
    <div className="home-container">
      <div className="home-header">
        {logado
          ? <h1>Olá, {login}!</h1>
          : <h1>Faça login</h1>
        }
        {logado
          ? <button className="home-btn-outline" onClick={sair}>Sair</button>
          : <Link to="/login" className="home-btn-outline">Login</Link>
        }
      </div>

      <div className="home-buttons">
        <Link to="/em-alta" className="home-btn">
          Músicas em Alta
        </Link>

        <Link to="/busca" className="home-btn">
          Buscar Músicas
        </Link>

        {logado && (
          <Link to="/recomendacoes" className="home-btn">
            Para Você
          </Link>
        )}

        {logado && (
          <Link to="/playlists" className="home-btn">
            Playlists
          </Link>
        )}

        {logado && (
          <Link to="/historico" className="home-btn">
            Histórico
          </Link>
        )}

        {role === 'ADMIN' && (
          <Link to="/admin/users" className="home-btn">
            Gerenciar Usuários
          </Link>
        )}
      </div>
    </div>
  );
}