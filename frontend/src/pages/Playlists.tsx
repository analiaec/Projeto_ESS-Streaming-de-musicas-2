import React, { useEffect, useState }              from 'react';
import { api, createPlaylist, updatePlaylist,
         deletePlaylist, removeMusicFromPlaylistApi } from '../api';
import { useAuth }                                    from '../contexts/AuthContext';
import { useToast }                                   from '../contexts/ToastContext';
import { Navbar }                                     from '../components/Navbar';
import { MusicaCard }                                 from '../components/MusicaCard';
import './Playlists.css';

export function Playlists() {
  const { login }                             = useAuth();
  const { toast }                             = useToast();
  const [playlists,  setPlaylists]            = useState<any[]>([]);
  const [loading,    setLoading]              = useState(true);
  const [creating,   setCreating]             = useState(false);
  const [deletingId, setDeletingId]           = useState<number | null>(null);
  const [editingId,  setEditingId]            = useState<number | null>(null);
  const [expandedId, setExpandedId]           = useState<number | null>(null);
  const [name,       setName]                 = useState('');
  const [descricao,  setDescricao]            = useState('');
  const [publica,    setPublica]              = useState(true);
  const [erroForm,   setErroForm]             = useState('');

  useEffect(() => {
    api.get('/playlists')
      .then(res => {
        const body = res.data;
        setPlaylists(body?.value ? body.value : Array.isArray(body) ? body : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErroForm('');
    if (!name.trim()) { setErroForm('Nome é obrigatório.'); return; }
    setCreating(true);
    try {
      if (editingId !== null) {
        const updated = await updatePlaylist(editingId, { nome: name, descricao, publica });
        setPlaylists(prev => prev.map(pl => pl.id === editingId ? { ...pl, ...updated } : pl));
        setEditingId(null);
        toast('Playlist atualizada!', 'success');
      } else {
        const created = await createPlaylist({ nome: name, descricao, publica, ownerLogin: login ?? 'unknown' });
        setPlaylists(prev => [...prev, { ...created, musicas: [] }]);
        toast('Playlist criada!', 'success');
      }
      setName(''); setDescricao(''); setPublica(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao salvar playlist.';
      setErroForm(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setCreating(false);
    }
  }

  function handleEdit(pl: any) {
    setEditingId(pl.id); setName(pl.nome ?? ''); setDescricao(pl.descricao ?? '');
    setPublica(!!pl.publica); setErroForm('');
  }

  function handleCancelEdit() {
    setEditingId(null); setName(''); setDescricao(''); setPublica(true); setErroForm('');
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Excluir esta playlist?')) return;
    setDeletingId(id);
    try {
      await deletePlaylist(id);
      setPlaylists(prev => prev.filter(pl => pl.id !== id));
      if (expandedId === id) setExpandedId(null);
      toast('Playlist excluída.', 'info');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao excluir.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRemoveMusica(playlistId: number, musicaId: number) {
    try {
      const updated = await removeMusicFromPlaylistApi(playlistId, musicaId);
      setPlaylists(prev => prev.map(pl => pl.id === playlistId ? updated : pl));
      toast('Música removida.', 'info');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao remover música.', 'error');
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>📋 Playlists</h1>

          {login && (
            <div className="pl-create-card card">
              <h2 className="pl-form-title">{editingId ? 'Editar Playlist' : 'Nova Playlist'}</h2>
              <form className="pl-form" onSubmit={handleCreate}>
                <div className="form-group">
                  <label className="form-label">Nome *</label>
                  <input placeholder="Nome da playlist" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Descrição</label>
                  <input placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Visibilidade</label>
                  <select value={publica ? 'publica' : 'privada'} onChange={e => setPublica(e.target.value === 'publica')}>
                    <option value="publica">Pública</option>
                    <option value="privada">Privada</option>
                  </select>
                </div>
                {erroForm && <div className="alert alert-error">{erroForm}</div>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={creating}>
                    {creating ? 'Salvando…' : editingId ? 'Salvar' : 'Criar Playlist'}
                  </button>
                  {editingId && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={handleCancelEdit}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          )}

          {loading && <div className="loader-wrap"><span className="loader" /></div>}

          {!loading && playlists.length === 0 && (
            <div className="empty-state">Nenhuma playlist ainda.{login ? ' Crie a primeira!' : ''}</div>
          )}

          {!loading && playlists.length > 0 && (
            <ul className="pl-list">
              {playlists.map(pl => {
                const isOwner    = login === pl.ownerLogin;
                const isExpanded = expandedId === pl.id;
                const musicas    = pl.musicas ?? [];

                return (
                  <li key={pl.id} className="pl-card card">
                    <div className="pl-card-header">
                      <span className="pl-card-nome">{pl.nome}</span>
                      <span className={`badge ${pl.publica ? 'badge-green' : 'badge-orange'}`}>
                        {pl.publica ? 'Pública' : 'Privada'}
                      </span>
                    </div>
                    {pl.descricao && <p className="pl-card-desc">{pl.descricao}</p>}
                    <div className="pl-card-meta">
                      por {pl.ownerLogin} · {musicas.length} música{musicas.length !== 1 ? 's' : ''}
                    </div>

                    <div className="pl-card-actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => setExpandedId(isExpanded ? null : pl.id)}>
                        {isExpanded ? 'Fechar' : '🎵 Ver músicas'}
                      </button>
                      {isOwner && (
                        <>
                          <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(pl)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pl.id)} disabled={deletingId === pl.id}>
                            {deletingId === pl.id ? 'Excluindo…' : 'Excluir'}
                          </button>
                        </>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="pl-expanded">
                        {musicas.length === 0 ? (
                          <p className="pl-empty-hint">
                            Nenhuma música ainda. Vá em <strong>Buscar</strong> e adicione músicas usando o botão ＋.
                          </p>
                        ) : (
                          <ul className="musica-list">
                            {musicas.map((m: any) => (
                              <MusicaCard
                                key={m.id}
                                musica={m}
                                extraAction={
                                  isOwner
                                    ? <button
                                        className="btn btn-ghost btn-sm pl-remove-btn"
                                        title="Remover da playlist"
                                        onClick={() => handleRemoveMusica(pl.id, m.id)}
                                      >✕</button>
                                    : undefined
                                }
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default Playlists;
