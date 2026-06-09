import { useEffect, useState } from 'react';
import { api, musicasUrl }     from '../api';
import { useAuth }             from '../contexts/AuthContext';
import { MusicaCard }          from '../components/MusicaCard';
import { Navbar }              from '../components/Navbar';
import './Recomendacoes.css';

export function Recomendacoes() {
  const { login }                       = useAuth();
  const [recomendacoes, setRec]         = useState<any[]>([]);
  const [carregando, setCarr]           = useState(true);
  const [erro, setErro]                 = useState<string | null>(null);

  useEffect(() => {
    if (!login) return;

    api.get(musicasUrl('/recomendadas'))
      .then(res => setRec(res.data))
      .catch(() => setErro('Erro ao carregar recomendações.'))
      .finally(() => setCarr(false));
  }, [login]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>✨ Para Você</h1>

          {carregando && <div className="loader-wrap"><span className="loader" /></div>}
          {erro && <div className="alert alert-error">{erro}</div>}

          {!carregando && !erro && recomendacoes.length === 0 && (
            <div className="empty-state">
              Nenhuma recomendação disponível ainda. Comece a ouvir músicas!
            </div>
          )}

          {recomendacoes.length > 0 && (
            <ul className="musica-list">
              {recomendacoes.map(score => (
                <MusicaCard key={score.id} musica={score.musica} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
