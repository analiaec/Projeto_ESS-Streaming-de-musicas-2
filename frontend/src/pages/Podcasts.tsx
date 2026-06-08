import { useEffect, useState } from 'react';
import { Link }               from 'react-router-dom';
import { getPodcastsApi }     from '../api';
import { Podcast }            from '../types';
import { Navbar }             from '../components/Navbar';
import './Podcasts.css';

export function Podcasts() {
  const [podcasts,   setPodcasts]   = useState<Podcast[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro,       setErro]       = useState<string | null>(null);

  useEffect(() => {
    getPodcastsApi()
      .then(data => setPodcasts(data))
      .catch(() => setErro('Não foi possível conectar ao servidor. Verifique se o backend está rodando.'))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>🎙 Podcasts</h1>

          {carregando && <div className="loader-wrap"><span className="loader" /></div>}
          {erro && <div className="alert alert-error">{erro}</div>}

          {!carregando && !erro && podcasts.length === 0 && (
            <div className="empty-state">Nenhum podcast disponível ainda.</div>
          )}

          {!carregando && !erro && podcasts.length > 0 && (
            <div className="podcasts-grid">
              {podcasts.map(p => (
                <Link key={p.login} to={`/podcast/${p.login}`} className="podcast-card card">
                  <div className="podcast-card-icon">🎙</div>
                  <div className="podcast-card-nome">{p.name}</div>
                  <div className="podcast-card-handle">@{p.login}</div>
                  {p.descricao && (
                    <div className="podcast-card-desc">{p.descricao}</div>
                  )}
                  <span className="podcast-card-cta">Ver episódios →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
