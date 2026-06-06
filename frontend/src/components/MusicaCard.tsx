import { useState } from 'react';
import { api }      from '../api';
import { useAuth }  from '../contexts/AuthContext';
import { Musica }   from '../types';
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
      await api.post(
        `/users/${login}/musicas/${musica.id}/reproducao`,
        {}
      );
      setRepOk(true);
      onReproduzir?.(musica.id);
      setTimeout(() => setRepOk(false), 3000);
    } catch (e) {
      console.error('Erro ao reproduzir', e);
    } finally {
      setRep(false);
    }
  }
  function formatarReproducoes(n: number): string {
  if (n >= 1000) {
    const valor = n / 1000;
    // se tiver decimal relevante mostra uma casa (ex: 1.2k), senão mostra inteiro (ex: 10k)
    return valor % 1 === 0
      ? `${valor}k`
      : `${valor.toFixed(1)}k`;
  }
  return n.toString();
}

  return (
    <li className="musica-item">
      <div className="musica-info">
        {posicao && (
          <span className="musica-posicao">#{posicao}</span>
        )}
        <strong>{musica.titulo}</strong>
        {' - '}
        {musica.artistas?.map(a => a.nomeArtistico).join(', ')}
        {' - '}
        {musica.genero}
        {exibirReproducoes && (
          <span className="musica-reproducoes">
            {' - '}{formatarReproducoes(musica.reproducoes)} rep.
          </span>
        )}
      </div>

      {login && (
        <button
          className={`musica-btn-play ${reproduzindo ? 'carregando' : ''} ${reproduzido ? 'reproduzido' : ''}`}
          onClick={reproduzir}
          disabled={reproduzindo}
          title={reproduzindo ? 'Reproduzindo...' : reproduzido ? 'Reproduzido!' : 'Reproduzir'}
        >
          {reproduzindo ? (
            <span className="spinner" />
          ) : (
            <span className="play-icon">▶</span>
          )}
        </button>
      )}
    </li>
  );
}