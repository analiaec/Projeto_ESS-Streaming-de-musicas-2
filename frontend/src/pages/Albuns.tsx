import React, { useEffect, useState } from 'react';
import { getAlbunsApi, uploadAlbumImage } from '../api';
import './Albuns.css';

export function Albuns() {
  const [albuns, setAlbuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAlbunsApi()
      .then((data) => { if (mounted) setAlbuns(data || []); })
      .catch(() => { if (mounted) setAlbuns([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false };
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, albumId: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadAlbumImage(albumId, file);
      setAlbuns((prev) => prev.map(a => a.id === albumId ? updated : a));
    } catch (err) {
      // simple error handling
      console.error('Upload error', err);
      alert('Erro ao enviar imagem');
    }
  }

  if (loading) return <div className="albuns-root">Carregando álbuns...</div>;

  return (
    <div className="albuns-root">
      <h2>Álbuns</h2>
      <div className="albuns-grid">
        {albuns.map(album => (
          <div key={album.id} className="album-card">
            <div className="cover">
              {album.imageUrl ? (
                <img src={`http://localhost:3000${album.imageUrl}`} alt={album.nome} />
              ) : (
                <div className="placeholder">Sem capa</div>
              )}
            </div>
            <div className="meta">
              <div className="title">{album.nome}</div>
              <div className="date">{album.data}</div>
            </div>
            <div className="actions">
              <label className="upload-btn">
                Enviar capa
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, album.id)} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Albuns;
