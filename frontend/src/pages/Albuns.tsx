import React, { useEffect, useState }  from 'react';
import { getAlbunsApi }                from '../api';
import { backendBaseUrl }              from '../api';
import { Navbar }                      from '../components/Navbar';
import './Albuns.css';

export function Albuns() {
  const [albuns,  setAlbuns]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbunsApi()
      .then(data => setAlbuns(data || []))
      .catch(() => setAlbuns([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>💿 Álbuns</h1>

          {loading && <div className="loader-wrap"><span className="loader" /></div>}

          {!loading && albuns.length === 0 && (
            <div className="empty-state">Nenhum álbum cadastrado ainda.</div>
          )}

          {!loading && albuns.length > 0 && (
            <div className="album-grid">
              {albuns.map(album => {
                const capa = album.capaUrl || album.imageUrl;
                const artistaNomes: string[] = Array.from(new Set(
                  (album.artistas?.length ? album.artistas : (album.musicas ?? []).flatMap((m: any) => m.artistas ?? []))
                    .map((a: any) => a.nomeArtistico)
                    .filter(Boolean)
                ));
                return (
                  <div key={album.id} className="album-card card">
                    <div className="album-cover">
                      {capa ? (
                        <img src={capa.startsWith('http') ? capa : `${backendBaseUrl}${capa}`} alt={album.nome} />
                      ) : (
                        <div className="album-cover-placeholder">💿</div>
                      )}
                    </div>
                    <div className="album-info">
                      <div className="album-nome">{album.nome}</div>
                      {artistaNomes.length > 0 && (
                        <div className="album-artista">{artistaNomes.join(', ')}</div>
                      )}
                      {album.data && <div className="album-data">{album.data}</div>}
                      {album.musicas?.length > 0 && (
                        <div className="album-faixas">{album.musicas.length} faixa{album.musicas.length !== 1 ? 's' : ''}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Albuns;
