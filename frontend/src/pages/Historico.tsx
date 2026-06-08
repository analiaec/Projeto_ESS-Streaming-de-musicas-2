import { useEffect, useState } from 'react';
import { api }                 from '../api';
import { Musica }              from '../types';
import { useAuth }             from '../contexts/AuthContext';
import { MusicaCard }          from '../components/MusicaCard';
import { Navbar }              from '../components/Navbar';
import './Historico.css';

export function Historico() {
  const { login }                   = useAuth();
  const [historico, setHistorico]   = useState<Musica[]>([]);
  const [carregando, setCarr]       = useState(true);
  const [erro, setErro]             = useState<string | null>(null);

  useEffect(() => {
    if (!login) return;

    api.get(`/users/${login}/playback/music`)
      .then(res => {
        const musicasUnicas: Musica[] = [];
        const idsVistos = new Set<number>();
        for (const pb of res.data) {
          if (pb.musica && !idsVistos.has(pb.musica.id)) {
            idsVistos.add(pb.musica.id);
            musicasUnicas.push(pb.musica);
          }
          if (musicasUnicas.length === 10) break;
        }
        setHistorico(musicasUnicas);
      })
      .catch(err => {
        if (err.response?.status === 404) setHistorico([]);
        else setErro('Erro ao carregar histórico.');
      })
      .finally(() => setCarr(false));
  }, [login]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>🕗 Histórico</h1>

          {carregando && <div className="loader-wrap"><span className="loader" /></div>}
          {erro && <div className="alert alert-error">{erro}</div>}

          {!carregando && !erro && historico.length === 0 && (
            <div className="empty-state">Nenhuma música ouvida ainda. Comece a explorar!</div>
          )}

          {historico.length > 0 && (
            <ul className="musica-list">
              {historico.map(musica => (
                <MusicaCard key={musica.id} musica={musica} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
