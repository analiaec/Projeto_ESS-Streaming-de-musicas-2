import { useState }        from 'react';
import { api, musicasUrl } from '../api';
import { Musica }          from '../types';
import { MusicaCard }      from '../components/MusicaCard';
import { Navbar }          from '../components/Navbar';
import './Busca.css';

export function Busca() {
  const [termo,      setTermo]      = useState('');
  const [genero,     setGenero]     = useState('');
  const [artista,    setArtista]    = useState('');
  const [resultados, setResultados] = useState<Musica[]>([]);
  const [buscou,     setBuscou]     = useState(false);
  const [carregando, setCarregando] = useState(false);

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

          {carregando && (
            <div className="loader-wrap">
              <span className="loader" />
            </div>
          )}

          {buscou && !carregando && resultados.length === 0 && (
            <div className="empty-state">Nenhum resultado para essa busca.</div>
          )}

          {resultados.length > 0 && (
            <ul className="musica-list">
              {resultados.map(musica => (
                <MusicaCard key={musica.id} musica={musica} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
