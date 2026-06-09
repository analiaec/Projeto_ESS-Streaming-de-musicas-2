import React, { useEffect, useState }              from 'react';
import { api, createPlaylist, updatePlaylist,
         deletePlaylist, removeMusicFromPlaylistApi } from '../api';
import { backendBaseUrl }                            from '../api';
import { useAuth }                                   from '../contexts/AuthContext';
import { useToast }                                  from '../contexts/ToastContext';
import { Navbar }                                    from '../components/Navbar';
import { MusicaCard }                                from '../components/MusicaCard';
import { AddToPlaylistBtn }                          from '../components/AddToPlaylistBtn';
import './Playlists.css';

type Expanded = number | 'create' | null;

export function Playlists() {
  const { login }                         = useAuth();
  const { toast }                         = useToast();
  const [playlists,  setPlaylists]        = useState<any[]>([]);
  const [myPl,       setMyPl]             = useState<any[]>([]);
  const [loading,    setLoading]          = useState(true);
  const [expandedId, setExpandedId]       = useState<Expanded>(null);
  const [editingId,  setEditingId]        = useState<number | null>(null);
  const [deletingId, setDeletingId]       = useState<number | null>(null);
  const [saving,     setSaving]           = useState(false);
  const [name,       setName]             = useState('');
  const [descricao,  setDescricao]        = useState('');
  const [publica,    setPublica]          = useState(true);
  const [erroForm,   setErroForm]         = useState('');

  useEffect(() => {
    api.get('/playlists')
      .then(res => {
        const body = res.data;
        const all  = body?.value ? body.value : Array.isArray(body) ? body : [];
        setPlaylists(all);
        if (login) setMyPl(all.filter((p: any) => p.ownerLogin === login));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [login]);

  function openCreate() {
    setName(''); setDescricao(''); setPublica(true); setErroForm('');
    setEditingId(null);
    setExpandedId('create');
  }

  function openEdit(pl: any) {
    setName(pl.nome ?? ''); setDescricao(pl.descricao ?? '');
    setPublica(!!pl.publica); setErroForm('');
    setEditingId(pl.id);
    setExpandedId(pl.id);
  }

  function toggle(id: number) {
    setExpandedId(prev => prev === id ? null : id);
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErroForm('');
    if (!name.trim()) { setErroForm('Por favor preencha o campo do nome.'); return; }
    setSaving(true);
    try {
      if (editingId !== null) {
        const updated = await updatePlaylist(editingId, { nome: name, descricao, publica });
        setPlaylists(prev => prev.map(pl => pl.id === editingId ? { ...pl, ...updated } : pl));
        setMyPl(prev => prev.map(pl => pl.id === editingId ? { ...pl, ...updated } : pl));
        setEditingId(null);
        toast('Playlist atualizada!', 'success');
      } else {
        const created = await createPlaylist({ nome: name, descricao, publica, ownerLogin: login ?? '' });
        const withMusicas = { ...created, musicas: [] };
        setPlaylists(prev => [withMusicas, ...prev]);
        setMyPl(prev => [withMusicas, ...prev]);
        toast('Playlist criada!', 'success');
        setExpandedId(null);
      }
      setName(''); setDescricao(''); setPublica(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao salvar.';
      setErroForm(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Excluir esta playlist?')) return;
    setDeletingId(id);
    try {
      await deletePlaylist(id);
      setPlaylists(prev => prev.filter(pl => pl.id !== id));
      setMyPl(prev => prev.filter(pl => pl.id !== id));
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
      toast(err?.response?.data?.message || 'Erro ao remover.', 'error');
    }
  }

  function coverSrc(pl: any): string | null {
    const first = pl.musicas?.[0];
    if (!first?.album?.capaUrl) return null;
    const c = first.album.capaUrl;
    return c.startsWith('http') ? c : `${backendBaseUrl}${c}`;
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>📋 Playlists</h1>

          {loading && <div className="loader-wrap"><span className="loader" /></div>}

          {!loading && (
            <div className="pl-grid">

              {/* ── Criar playlist card ── */}
              {login && (
                <div className={`pl-card card ${expandedId === 'create' ? 'pl-card-expanded' : ''}`}>
                  {expandedId !== 'create' ? (
                    <div className="pl-clickable" onClick={openCreate}>
                      <div className="pl-cover pl-cover-new">
                        <span className="pl-cover-plus">＋</span>
                      </div>
                      <div className="pl-info">
                        <div className="pl-nome">Nova Playlist</div>
                      </div>
                    </div>
                  ) : (
                    <div className="pl-form-wrap">
                      <div className="pl-form-header">
                        <span className="pl-form-title">Nova Playlist</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setExpandedId(null)}>✕ Fechar</button>
                      </div>
                      <form className="pl-form" onSubmit={handleSubmit}>
                        <div className="pl-form-fields">
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
                        </div>
                        {erroForm && <div className="alert alert-error">{erroForm}</div>}
                        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                          {saving ? 'Criando…' : 'Criar Playlist'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}

              {/* ── Playlist cards ── */}
              {playlists.map(pl => {
                const isExpanded = expandedId === pl.id;
                const isOwner    = login === pl.ownerLogin;
                const isEditing  = editingId === pl.id;
                const musicas    = pl.musicas ?? [];
                const cover      = coverSrc(pl);

                return (
                  <div key={pl.id} className={`pl-card card ${isExpanded ? 'pl-card-expanded' : ''}`}>
                    <div
                      className="pl-clickable"
                      onClick={() => toggle(pl.id)}
                      title={isExpanded ? 'Fechar' : 'Ver músicas'}
                    >
                      <div className="pl-cover">
                        {cover ? (
                          <img src={cover} alt={pl.nome} />
                        ) : (
                          <div className="pl-cover-placeholder">🎵</div>
                        )}
                        <div className="pl-cover-overlay">{isExpanded ? '▲' : '▶'}</div>
                      </div>
                      <div className="pl-info">
                        <div className="pl-nome">{pl.nome}</div>
                        {pl.descricao && <div className="pl-desc">{pl.descricao}</div>}
                        <div className="pl-meta">
                          {musicas.length} música{musicas.length !== 1 ? 's' : ''}
                          {' · '}
                          <span className={`badge ${pl.publica ? 'badge-green' : 'badge-orange'}`}>
                            {pl.publica ? 'Pública' : 'Privada'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pl-expanded-body">
                        {/* Editar form inline */}
                        {isEditing ? (
                          <form className="pl-edit-form" onSubmit={handleSubmit}>
                            <div className="pl-form-fields">
                              <div className="form-group">
                                <label className="form-label">Nome</label>
                                <input value={name} onChange={e => setName(e.target.value)} />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Descrição</label>
                                <input value={descricao} onChange={e => setDescricao(e.target.value)} />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Visibilidade</label>
                                <select value={publica ? 'publica' : 'privada'} onChange={e => setPublica(e.target.value === 'publica')}>
                                  <option value="publica">Pública</option>
                                  <option value="privada">Privada</option>
                                </select>
                              </div>
                            </div>
                            {erroForm && <div className="alert alert-error">{erroForm}</div>}
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
                              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancelar</button>
                            </div>
                          </form>
                        ) : (
                          isOwner && (
                            <div className="pl-owner-actions">
                              <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); openEdit(pl); }}>Editar</button>
                              <button className="btn btn-danger btn-sm" onClick={e => { e.stopPropagation(); handleDelete(pl.id); }} disabled={deletingId === pl.id}>
                                {deletingId === pl.id ? 'Excluindo…' : 'Excluir'}
                              </button>
                            </div>
                          )
                        )}

                        {/* Músicas */}
                        {musicas.length === 0 ? (
                          <p className="pl-empty-hint">
                            Nenhuma música ainda. Vá em <strong>Buscar</strong> e adicione músicas usando o botão ＋.
                          </p>
                        ) : (
                          <ul className="musica-list">
                            {musicas.map((m: any, i: number) => (
                              <MusicaCard
                                key={m.id}
                                musica={m}
                                posicao={i + 1}
                                extraAction={
                                  <>
                                    {login && <AddToPlaylistBtn musicaId={m.id} playlists={myPl} />}
                                    {isOwner && (
                                      <button
                                        className="btn btn-ghost btn-sm pl-remove-btn"
                                        title="Remover da playlist"
                                        onClick={() => handleRemoveMusica(pl.id, m.id)}
                                      >✕</button>
                                    )}
                                  </>
                                }
                              />
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {playlists.length === 0 && !login && (
                <div className="empty-state" style={{ gridColumn: '1 / -1' }}>Nenhuma playlist pública ainda.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Playlists;
