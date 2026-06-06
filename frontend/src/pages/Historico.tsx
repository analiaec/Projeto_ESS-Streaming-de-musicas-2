import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { api }                 from '../api';
import { Musica }              from '../types';
import { useAuth }             from '../contexts/AuthContext';
import './Historico.css';
import './Home.css';

export function Historico() {
  const { login, sair }                 = useAuth();
  const [historico, setHistorico] = useState<Musica[]>([]);
  const [carregando, setCarr]     = useState(true);
  const [erro, setErro]           = useState<string | null>(null);

  useEffect(() => {
    if (!login) return;

    api.get(`/users/${login}/playback/music`)
      .then(res => {
        const dados = res.data;
        const musicasUnicas: Musica[] = [];
        const idsVistos = new Set<number>();

        for (const playback of dados) {
          if (playback.musica && !idsVistos.has(playback.musica.id)) {
            idsVistos.add(playback.musica.id);
            musicasUnicas.push(playback.musica);
          }
          if (musicasUnicas.length === 10) break;
        }

        setHistorico(musicasUnicas);
      })
      .catch(() => setErro('Erro ao carregar historico'))
      .finally(() => setCarr(false));
  }, [login]);

  if (carregando) return <p>Carregando...</p>;
  if (erro)       return <p>{erro}</p>;

  return (
    <div className="historico-container">
      <div className="home-header">
        <h1>Olá, {login}!</h1>
        <button className="home-btn-outline" onClick={sair}>Sair</button>
      </div>
      <div className="historico-header">
        <Link to="/" className="historico-voltar">Voltar</Link>
        <h1 className="historico-titulo">Histórico</h1>
      </div>

      {historico.length === 0 ? (
        <p>Nenhuma música ouvida ainda.</p>
      ) : (
        <ul className="historico-lista">
          {historico.map((musica, index) => (
            <li key={musica.id} className="historico-item">
              <span className="historico-posicao">#{index + 1}</span>
              <strong>{musica.titulo}</strong>
              {' - '}
              {musica.artistas?.map(a => a.nomeArtistico).join(', ')}
              {' - '}
              {musica.genero}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}