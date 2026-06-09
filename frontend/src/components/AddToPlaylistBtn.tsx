import React, { useEffect, useRef, useState } from 'react';
import { addMusicToPlaylistApi }               from '../api';
import { useToast }                            from '../contexts/ToastContext';
import './AddToPlaylistBtn.css';

interface Props {
  musicaId: number;
  playlists: any[];
}

export function AddToPlaylistBtn({ musicaId, playlists }: Props) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState<number | null>(null);
  const { toast }             = useToast();
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  async function add(playlistId: number) {
    setLoading(playlistId);
    try {
      await addMusicToPlaylistApi(playlistId, musicaId);
      toast('Música adicionada à playlist!', 'success');
      setOpen(false);
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Erro ao adicionar.', 'error');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="add-pl-wrap" ref={ref}>
      <button
        className="btn btn-ghost btn-sm add-pl-btn"
        title="Adicionar a uma playlist"
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
      >＋</button>

      {open && (
        <ul className="add-pl-dropdown">
          {playlists.length === 0 ? (
            <li className="add-pl-empty">Crie uma playlist primeiro</li>
          ) : (
            playlists.map(pl => (
              <li key={pl.id}>
                <button
                  className="add-pl-option"
                  disabled={loading === pl.id}
                  onClick={() => add(pl.id)}
                >
                  {loading === pl.id ? '…' : pl.nome}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
