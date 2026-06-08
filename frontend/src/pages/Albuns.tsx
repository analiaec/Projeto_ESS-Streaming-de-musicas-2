import React, { useEffect, useState }         from 'react';
import { getAlbunsApi, uploadAlbumImage }      from '../api';
import { backendBaseUrl }                      from '../api';
import { Navbar }                              from '../components/Navbar';
import { useToast }                            from '../contexts/ToastContext';
import './Albuns.css';

export function Albuns() {
  const [albuns,  setAlbuns]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast }             = useToast();

  useEffect(() => {
    getAlbunsApi()
      .then(data => setAlbuns(data || []))
      .catch(() => setAlbuns([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, albumId: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const updated = await uploadAlbumImage(albumId, file);
      setAlbuns(prev => prev.map(a => a.id === albumId ? updated : a));
      toast('Capa atualizada!', 'success');
    } catch {
      toast('Erro ao enviar imagem.', 'error');
    }
  }

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
              {albuns.map(album => (
                <div key={album.id} className="album-card card">
                  <div className="album-cover">
                    {album.imageUrl ? (
                      <img src={`${backendBaseUrl}${album.imageUrl}`} alt={album.nome} />
                    ) : (
                      <div className="album-cover-placeholder">💿</div>
                    )}
                  </div>
                  <div className="album-info">
                    <div className="album-nome">{album.nome}</div>
                    {album.data && <div className="album-data">{album.data}</div>}
                  </div>
                  <label className="btn btn-ghost btn-sm album-upload-btn">
                    Enviar capa
                    <input type="file" accept="image/*"
                      onChange={e => handleFileChange(e, album.id)} />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Albuns;
