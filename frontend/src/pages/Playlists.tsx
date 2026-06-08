import React, { useEffect, useState }         from 'react';
import { api, createPlaylist, deletePlaylist } from '../api';
import { useAuth }                             from '../contexts/AuthContext';
import { useToast }                            from '../contexts/ToastContext';
import { Navbar }                              from '../components/Navbar';
import './Playlists.css';

export function Playlists() {
  const { login }                                = useAuth();
  const { toast }                                = useToast();
  const [playlists, setPlaylists]               = useState<any[]>([]);
  const [loading,   setLoading]                 = useState(true);
  const [creating,  setCreating]                = useState(false);
  const [deletingId, setDeletingId]             = useState<number | null>(null);
  const [name,      setName]                    = useState('');
  const [descricao, setDescricao]               = useState('');
  const [publica,   setPublica]                 = useState(true);
  const [erroForm,  setErroForm]                = useState('');

  useEffect(() => {
    api.get('/playlists')
      .then(res => {
        const body = res.data;
        setPlaylists(body?.value ? body.value : Array.isArray(body) ? body : []);
      })
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErroForm('');
    if (!name.trim()) { setErroForm('Nome é obrigatório.'); return; }

    setCreating(true);
    try {
      const created = await createPlaylist({
        nome: name, descricao, publica,
        ownerLogin: login ?? 'unknown',
      });
      setPlaylists(prev => [...prev, created]);
      setName('');
      setDescricao('');
      setPublica(true);
      toast('Playlist criada com sucesso!', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao criar playlist.';
      setErroForm(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Tem certeza que deseja excluir esta playlist?')) return;
    setDeletingId(id);
    try {
      await deletePlaylist(id);
      setPlaylists(prev => prev.filter(pl => pl.id !== id));
      toast('Playlist excluída.', 'info');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao excluir playlist.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>📋 Playlists</h1>

          <div className="pl-create-card card">
            <h2 className="pl-form-title">Nova Playlist</h2>
            <form className="pl-form" onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Nome *</label>
                <input placeholder="Nome da playlist" value={name}
                  onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Descrição</label>
                <input placeholder="Descrição (opcional)" value={descricao}
                  onChange={e => setDescricao(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Visibilidade</label>
                <select value={publica ? 'publica' : 'privada'}
                  onChange={e => setPublica(e.target.value === 'publica')}>
                  <option value="publica">Pública</option>
                  <option value="privada">Privada</option>
                </select>
              </div>
              {erroForm && <div className="alert alert-error">{erroForm}</div>}
              <button type="submit" className="btn btn-primary btn-sm" disabled={creating}>
                {creating ? 'Criando…' : 'Criar Playlist'}
              </button>
            </form>
          </div>

          {loading && <div className="loader-wrap"><span className="loader" /></div>}

          {!loading && playlists.length === 0 && (
            <div className="empty-state">Nenhuma playlist ainda. Crie a primeira!</div>
          )}

          {!loading && playlists.length > 0 && (
            <ul className="pl-list">
              {playlists.map(pl => (
                <li key={pl.id} className="pl-card card">
                  <div className="pl-card-header">
                    <span className="pl-card-nome">{pl.nome}</span>
                    <span className={`badge ${pl.publica ? 'badge-green' : 'badge-orange'}`}>
                      {pl.publica ? 'Pública' : 'Privada'}
                    </span>
                  </div>
                  {pl.descricao && <p className="pl-card-desc">{pl.descricao}</p>}
                  <div className="pl-card-meta">por {pl.ownerLogin}</div>
                  <button
                    className="btn btn-danger btn-sm pl-delete"
                    onClick={() => handleDelete(pl.id)}
                    disabled={deletingId === pl.id}
                  >
                    {deletingId === pl.id ? 'Excluindo…' : 'Excluir'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Playlists;
