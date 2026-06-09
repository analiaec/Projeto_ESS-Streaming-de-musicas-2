import React, { useEffect, useRef, useState } from 'react';
import { api, musicasUrl, addMusicToPlaylistApi } from '../api';
import { Musica }          from '../types';
import { MusicaCard }      from '../components/MusicaCard';
import { Navbar }          from '../components/Navbar';
import { useAuth }         from '../contexts/AuthContext';
import { useToast }        from '../contexts/ToastContext';
import './Busca.css';

function AddToPlaylistBtn({ musicaId, playlists }: { musicaId: number; playlists: any[] }) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState<number | null>(null);
  const { toast }             = useToast();
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function add(playlistId: number) {
    setLoading(playlistId);
    try {
      await addMusicToPlaylistApi(playlistId, musicaId);
      toast('Música adicionada à playlist!', 'success');
      setOpen(false);
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao adicionar.', 'error');
    } finally {
      setLoading(null);
    }
  }

  if (!playlists.length) return null;

  return (
    <div className="add-pl-wrap" ref={ref}>
      <button
        className="btn btn-ghost btn-sm add-pl-btn"
        title="Adicionar a uma playlist"
        onClick={() => setOpen(o => !o)}
      >＋</button>
      {open && (
        <ul className="add-pl-dropdown">
          {playlists.map(pl => (
            <li key={pl.id}>
              <button
                className="add-pl-option"
                disabled={loading === pl.id}
                onClick={() => add(pl.id)}
              >
                {loading === pl.id ? '…' : pl.nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Busca() {
  const { login }                                  = useAuth();
  const [termo,      setTermo]                     = useState('');
  const [genero,     setGenero]                    = useState('');
  const [artista,    setArtista]                   = useState('');
  const [resultados, setResultados]                = useState<Musica[]>([]);
  const [buscou,     setBuscou]                    = useState(false);
  const [carregando, setCarregando]                = useState(false);
  const [playlists,  setPlaylists]                 = useState<any[]>([]);

  useEffect(() => {
    if (!login) return;
    api.get('/playlists')
      .then(res => {
        const body = res.data;
        const all  = body?.value ? body.value : Array.isArray(body) ? body : [];
        setPlaylists(all.filter((pl: any) => pl.ownerLogin === login));
      })
      .catch(() => {});
  }, [login]);

  async function buscar() {
    const params = new URLSearchParams();
    if (termo)   params.append('termo',   termo);
    if (genero)  params.append('genero',  genero);
    if (artista) params.append('artista', artista);

    setCarregando(true);
    setBuscou(false);
    try {
      const res = await api.get(musicasUrl(`?${params.toString()}`));
      setResultados(res.data);
    } catch {
      setResultados([]);
    } finally {
      setCarregando(false);
      setBuscou(true);
    }
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') buscar();
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>🔍 Buscar Músicas</h1>

          <div className="busca-form">
            <div className="busca-main-row">
              <input
                type="text"
                placeholder="Buscar por nome da música…"
                value={termo}
                onChange={e => setTermo(e.target.value)}
                onKeyDown={onKey}
                className="busca-main-input"
              />
              <button className="btn btn-primary busca-submit" onClick={buscar} disabled={carregando}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Buscar
              </button>
            </div>

            <div className="busca-filters-row">
              <select value={genero} onChange={e => setGenero(e.target.value)}>
                <option value="">Todos os gêneros</option>
                <option value="MPB">MPB</option>
                <option value="Bossa Nova">Bossa Nova</option>
                <option value="Samba">Samba</option>
                <option value="Rock">Rock</option>
                <option value="AltRock">AltRock</option>
                <option value="Axé">Axé</option>
              </select>

              <input
                type="text"
                placeholder="Filtrar por artista…"
                value={artista}
                onChange={e => setArtista(e.target.value)}
                onKeyDown={onKey}
              />
            </div>
          </div>

          {carregando && <div className="loader-wrap"><span className="loader" /></div>}

          {buscou && !carregando && resultados.length === 0 && (
            <div className="empty-state">Nenhum resultado para essa busca.</div>
          )}

          {resultados.length > 0 && (
            <ul className="musica-list">
              {resultados.map(musica => (
                <MusicaCard
                  key={musica.id}
                  musica={musica}
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
