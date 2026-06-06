import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { api, musicasUrl }     from '../api';
import { useAuth }             from '../contexts/AuthContext';
import { MusicaCard }          from '../components/MusicaCard';
import './Recomendacoes.css';
import './Home.css';

export function Recomendacoes() {
  const { login, sair}               = useAuth();
  const [recomendacoes, setRec] = useState<any[]>([]);
  const [carregando, setCarr]   = useState(true);
  const [erro, setErro]         = useState<string | null>(null);

  useEffect(() => {
    if (!login) return;

    api.get(musicasUrl('/recomendadas'))
      .then(res => setRec(res.data))
      .catch(() => setErro('Erro ao carregar recomendacoes'))
      .finally(() => setCarr(false));
  }, [login]);

  if (carregando) return <p>Carregando...</p>;
  if (erro)       return <p>{erro}</p>;

  return (
    <div className="rec-container">
      <div className="home-header">
        <h1>Olá, {login}!</h1>
        <button className="home-btn-outline" onClick={sair}>Sair</button>
      </div>
      <div className="rec-header">
        <Link to="/" className="rec-voltar">Voltar</Link>
        <h1 className="rec-titulo">Recomendações para {login}</h1>
      </div>

      {recomendacoes.length === 0 ? (
        <p>Nenhuma recomendação disponível ainda. Comece a ouvir músicas!</p>
      ) : (
        <ul className="rec-lista">
          {recomendacoes.map(score => (
            <MusicaCard key={score.id} musica={score.musica} />
          ))}
        </ul>
      )}
    </div>
  );
}