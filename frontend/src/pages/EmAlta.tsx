import { useEffect, useState } from 'react';
import { api, musicasUrl }      from '../api';
import { Musica }               from '../types';
import { MusicaCard }           from '../components/MusicaCard';
import { AddToPlaylistBtn }     from '../components/AddToPlaylistBtn';
import { Navbar }               from '../components/Navbar';
import { useAuth }              from '../contexts/AuthContext';
import './EmAlta.css';

export function EmAlta() {
  const { login }                        = useAuth();
  const [emAlta,     setEmAlta]          = useState<Musica[]>([]);
  const [carregando, setCarregando]      = useState(true);
  const [erro,       setErro]            = useState<string | null>(null);
  const [playlists,  setPlaylists]       = useState<any[]>([]);

  useEffect(() => {
    api.get(musicasUrl('/em-alta'))
      .then(res => setEmAlta(res.data))
      .catch(() => setErro('Não foi possível carregar as músicas em alta.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    if (!login) { setPlaylists([]); return; }
    api.get('/playlists')
      .then(res => {
        const body = res.data;
        const all  = body?.value ? body.value : Array.isArray(body) ? body : [];
        setPlaylists(all.filter((pl: any) => pl.ownerLogin === login));
      })
      .catch(() => {});
  }, [login]);

  function handleReproduzir(id: number) {
    setEmAlta(prev =>
      prev.map(m => m.id === id ? { ...m, reproducoes: m.reproducoes + 1 } : m)
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <div className="page-top">
            <h1 className="section-title">🔥 Músicas em Alta</h1>
            <p className="page-sub">As mais tocadas da plataforma agora</p>
          </div>

          {carregando && (
            <div className="loader-wrap">
              <span className="loader" />
            </div>
          )}

          {erro && <div className="alert alert-error">{erro}</div>}

          {!carregando && !erro && emAlta.length === 0 && (
            <div className="empty-state">Nenhuma música em alta no momento.</div>
          )}

          {!carregando && !erro && emAlta.length > 0 && (
            <ul className="musica-list">
              {emAlta.map((musica, index) => (
                <MusicaCard
                  key={musica.id}
                  musica={musica}
                  exibirReproducoes
                  onReproduzir={handleReproduzir}
                  posicao={index + 1}
                  extraAction={
                    login
                      ? <AddToPlaylistBtn musicaId={musica.id} playlists={playlists} />
                      : undefined
                  }
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
