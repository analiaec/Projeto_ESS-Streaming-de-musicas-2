import { Link }    from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';
export function Home() {
  const { login, logado, sair } = useAuth();

  return (
    <div className="home-container">
      <div className="home-header">
        {logado
          ? <h1>Ola, {login}!</h1>
          : <h1>Faca login</h1>
        }
        {logado
          ? <button onClick={sair}>Sair</button>
          : <Link to="/login" className="home-btn">Login</Link>
        }
      </div>

      <div className="home-buttons">
        <Link to="/em-alta" className="home-btn">
          Musicas em Alta
        </Link>
        <Link to="/busca" className="home-btn">
          Buscar Musicas
        </Link>
      </div>
    </div>
  );
}