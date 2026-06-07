import React, { useEffect, useState } from 'react';
import { api, createPlaylist, deletePlaylist } from '../api';
import './Playlists.css';

export function Playlists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
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
    if (!name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    setCreating(true);
    try {
      const created = await createPlaylist({ nome: name, descricao: descricao, publica, ownerLogin: 'LuisCardoso012' });
      setPlaylists(prev => [...prev, created]);
      setName('');
      setDescricao('');
      setPublica(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao criar playlist');
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

  return (
    <div className="playlists-root">
      <h2>Playlists</h2>
      <form className="playlist-create" onSubmit={handleCreate}>
        <input placeholder="Nome da playlist" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Descrição (opcional)" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <select value={publica ? 'publica' : 'privada'} onChange={e => setPublica(e.target.value === 'publica')}>
          <option value="publica">Pública</option>
          <option value="privada">Privada</option>
        </select>
        <button type="submit" disabled={creating}>{creating ? 'Criando...' : 'Criar playlist'}</button>
        {error && <div className="error">{error}</div>}
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
            <button
              type="button"
              className="playlist-delete"
              onClick={() => handleDelete(pl.id)}
              disabled={deletingId === pl.id}
            >
              {deletingId === pl.id ? 'Excluindo...' : 'Excluir'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Playlists;
