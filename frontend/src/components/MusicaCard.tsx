import { useState }       from 'react';
import { api }             from '../api';
import { backendBaseUrl }  from '../api';
import { useAuth }         from '../contexts/AuthContext';
import { Musica }          from '../types';
import './MusicaCard.css';

interface Props {
  musica:             Musica;
  exibirReproducoes?: boolean;
  onReproduzir?:      (id: number) => void;
  posicao?:           number;
}

export function MusicaCard({ musica, exibirReproducoes = false, onReproduzir, posicao }: Props) {
  const { login }               = useAuth();
  const [reproduzindo, setRep]  = useState(false);
  const [reproduzido, setRepOk] = useState(false);

  async function reproduzir() {
    if (!login || reproduzindo) return;
    setRep(true);
    try {
      await api.post(`/users/${login}/musicas/${musica.id}/reproducao`, {});
      setRepOk(true);
      onReproduzir?.(musica.id);
      setTimeout(() => setRepOk(false), 3000);
    } catch {
      // silent
    } finally {
      setRep(false);
    }
  }

  function formatarReproducoes(n: number): string {
    if (n >= 1000) {
      const v = n / 1000;
      return v % 1 === 0 ? `${v}k` : `${v.toFixed(1)}k`;
    }
    return n.toString();
  }

  return (
    <li className="musica-item">
      <div className="musica-capa">
        {musica.album?.capaUrl ? (
          <img
            src={`${backendBaseUrl}${musica.album.capaUrl}`}
            alt={musica.album.nome}
            className="musica-capa-img"
          />
        ) : (
          <div className="musica-capa-placeholder">♪</div>
        )}
      </div>

      <div className="musica-info">
        {posicao && <span className="musica-posicao">#{posicao}</span>}
        <strong className="musica-titulo-card">{musica.titulo}</strong>
        <span className="musica-separador">◦</span>
        {musica.artistas?.map(a => a.nomeArtistico).join(', ')}
        <span className="musica-separador">◦</span>
        {musica.album?.nome}
        {exibirReproducoes && (
          <>
            <span className="musica-separador">◦</span>
            <span className="musica-reproducoes">{formatarReproducoes(musica.reproducoes)} rep.</span>
          </>
        )}
      </div>

      {login && (
        <button
          className={`musica-btn-play ${reproduzindo ? 'carregando' : ''} ${reproduzido ? 'reproduzido' : ''}`}
          onClick={reproduzir}
          disabled={reproduzindo}
          title={reproduzindo ? 'Reproduzindo…' : reproduzido ? 'Reproduzido!' : 'Reproduzir'}
        >
          {reproduzindo ? <span className="spinner" /> : <span className="play-icon">▶</span>}
        </button>
      )}
    </li>
  );
}
