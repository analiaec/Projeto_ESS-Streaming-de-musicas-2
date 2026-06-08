import React, { useEffect, useState } from 'react';
import { api, createPlaylist, deletePlaylist, updatePlaylist } from '../api';
import { useAuth } from '../contexts/AuthContext';
import './Playlists.css';

export function Playlists() {
  const { login, logado } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [descricao, setDescricao] = useState('');
  const [publica, setPublica] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/playlists')
      .then(res => {
        if (!mounted) return;
        // API may return { value: [...], Count } or an array directly
        const body = res.data;
        setPlaylists((body && body.value) ? body.value : (Array.isArray(body) ? body : []));
      })
      .catch(() => setPlaylists([]))
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false };
  }, []);

  if (loading) return <div className="playlists-root">Carregando playlists...</div>;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    const editingMode = editingId !== null;
    if (!name.trim()) {
      setError('Por favor preencha o campo do nome');
      return;
    }
    if (!logado || !login) {
      setError('Faça login para criar uma playlist');
      return;
    }
    setCreating(true);
    try {
      if (editingId !== null) {
        const updated = await updatePlaylist(editingId, { nome: name, descricao, publica });
        setPlaylists(prev => prev.map(pl => (pl.id === editingId ? updated : pl)));
        setSuccessMessage('playlist atualizada com sucesso');
      } else {
        const created = await createPlaylist({ nome: name, descricao: descricao, publica, ownerLogin: login });
        setPlaylists(prev => [...prev, created]);
        setSuccessMessage('playlist criada com sucesso');
      }
      setName('');
      setDescricao('');
      setPublica(true);
      setEditingId(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || (editingMode ? 'Erro ao atualizar playlist' : 'Erro ao criar playlist'));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm('Tem certeza que deseja excluir esta playlist?');
    if (!confirmed) return;

    setError(null);
    setDeletingId(id);
    try {
      await deletePlaylist(id);
      setPlaylists(prev => prev.filter(pl => pl.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao excluir playlist');
    } finally {
      setDeletingId(null);
    }
  }

  function handleEdit(pl: any) {
    setError(null);
    setSuccessMessage(null);
    setEditingId(pl.id);
    setName(pl.nome || '');
    setDescricao(pl.descricao || '');
    setPublica(!!pl.publica);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName('');
    setDescricao('');
    setPublica(true);
    setError(null);
    setSuccessMessage(null);
  }

  return (
    <div className="playlists-root">
      <h2>Playlists</h2>
      {!logado && <div className="playlist-hint">Faça login para criar playlists.</div>}
      <form className="playlist-create" onSubmit={handleCreate}>
        <input placeholder="Nome da playlist" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <select value={publica ? 'publica' : 'privada'} onChange={e => setPublica(e.target.value === 'publica')}>
          <option value="publica">Pública</option>
          <option value="privada">Privada</option>
        </select>
        <button type="submit" disabled={creating || !logado}>{creating ? (editingId !== null ? 'Atualizando...' : 'Criando...') : (editingId !== null ? 'Atualizar playlist' : 'Criar playlist')}</button>
        {editingId !== null && (
          <button type="button" className="playlist-cancel" onClick={handleCancelEdit}>
            Cancelar
          </button>
        )}
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </form>
      {playlists.length === 0 && <div>Nenhuma playlist encontrada.</div>}
      <ul className="playlists-list">
        {playlists.map(pl => (
          <li key={pl.id} className="playlist-card">
            <div className="playlist-header">
              <h3>{pl.nome}</h3>
              <span className={`playlist-visibility ${pl.publica ? 'publica' : 'privada'}`}>
                {pl.publica ? 'Pública' : 'Privada'}
              </span>
            </div>
            {pl.descricao && <p className="desc">{pl.descricao}</p>}
            <div className="meta">Responsável: {pl.ownerLogin}</div>
            <div className="playlist-actions">
              <button
                type="button"
                className="playlist-edit"
                onClick={() => handleEdit(pl)}
              >
                Atualizar
              </button>
              <button
                type="button"
                className="playlist-delete"
                onClick={() => handleDelete(pl.id)}
                disabled={deletingId === pl.id}
              >
                {deletingId === pl.id ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
