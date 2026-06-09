import React, { useEffect, useState }                                        from 'react';
import { api, createPlaylist, updatePlaylist, deletePlaylist,
         addMusicToPlaylistApi, removeMusicFromPlaylistApi }                  from '../api';
import { useAuth }                                                             from '../contexts/AuthContext';
import { useToast }                                                            from '../contexts/ToastContext';
import { Navbar }                                                              from '../components/Navbar';
import './Playlists.css';

export function Playlists() {
  const { login }                                = useAuth();
  const { toast }                                = useToast();
  const [playlists,   setPlaylists]              = useState<any[]>([]);
  const [todasMusicas, setTodasMusicas]          = useState<any[]>([]);
  const [loading,     setLoading]                = useState(true);
  const [creating,    setCreating]               = useState(false);
  const [deletingId,  setDeletingId]             = useState<number | null>(null);
  const [editingId,   setEditingId]              = useState<number | null>(null);
  const [expandedId,  setExpandedId]             = useState<number | null>(null);
  const [name,        setName]                   = useState('');
  const [descricao,   setDescricao]              = useState('');
  const [publica,     setPublica]                = useState(true);
  const [erroForm,    setErroForm]               = useState('');
  const [busca,       setBusca]                  = useState('');
  const [buscando,    setBuscando]               = useState(false);

  useEffect(() => {
    api.get('/playlists')
      .then(res => {
        const body = res.data;
        setPlaylists(body?.value ? body.value : Array.isArray(body) ? body : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!busca.trim()) { setTodasMusicas([]); return; }
    const timer = setTimeout(() => {
      setBuscando(true);
      api.get(`/users/_/musicas`, { params: { termo: busca } })
        .then(res => setTodasMusicas(Array.isArray(res.data) ? res.data : []))
        .catch(() => setTodasMusicas([]))
        .finally(() => setBuscando(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [busca]);

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
      toast('Playlist excluída.', 'info');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao excluir.', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAddMusica(playlistId: number, musicaId: number) {
    try {
      const updated = await addMusicToPlaylistApi(playlistId, musicaId);
      setPlaylists(prev => prev.map(pl => pl.id === playlistId ? updated : pl));
      toast('Música adicionada!', 'success');
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao adicionar música.', 'error');
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
                const isOwner   = login === pl.ownerLogin;
                const isExpanded = expandedId === pl.id;
                const musicasNaPl = pl.musicas ?? [];
                const musicasIds  = new Set(musicasNaPl.map((m: any) => m.id));
                const sugestoes   = todasMusicas.filter((m: any) => !musicasIds.has(m.id));

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
                      por {pl.ownerLogin} · {musicasNaPl.length} música{musicasNaPl.length !== 1 ? 's' : ''}
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
                        {musicasNaPl.length === 0 ? (
                          <p className="pl-empty-hint">Nenhuma música nesta playlist.</p>
                        ) : (
                          <ul className="pl-musicas-list">
                            {musicasNaPl.map((m: any) => (
                              <li key={m.id} className="pl-musica-item">
                                <span className="pl-musica-titulo">{m.titulo}</span>
                                <span className="pl-musica-artista">
                                  {m.artistas?.map((a: any) => a.nomeArtistico).join(', ')}
                                </span>
                                {isOwner && (
                                  <button className="btn btn-ghost btn-sm pl-remove-btn"
                                    onClick={() => handleRemoveMusica(pl.id, m.id)}>✕</button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        {isOwner && (
                          <div className="pl-add-musica">
                            <input
                              className="pl-busca-musica"
                              placeholder="Buscar música para adicionar…"
                              value={busca}
                              onChange={e => setBusca(e.target.value)}
                            />
                            {busca && (
                              <ul className="pl-sugestoes">
                                {buscando && <li className="pl-sem-resultado">Buscando…</li>}
                                {!buscando && sugestoes.slice(0, 8).map((m: any) => (
                                  <li key={m.id} className="pl-sugestao-item">
                                    <span>{m.titulo} — {m.artistas?.map((a: any) => a.nomeArtistico).join(', ')}</span>
                                    <button className="btn btn-primary btn-sm"
                                      onClick={() => { handleAddMusica(pl.id, m.id); setBusca(''); }}>
                                      + Adicionar
                                    </button>
                                  </li>
                                ))}
                                {!buscando && sugestoes.length === 0 && <li className="pl-sem-resultado">Nenhum resultado.</li>}
                              </ul>
                            )}
                          </div>
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
