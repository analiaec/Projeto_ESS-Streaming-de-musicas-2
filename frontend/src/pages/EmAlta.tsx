import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { api, musicasUrl }     from '../api';
import { Musica }              from '../types';

export function EmAlta() {
  const [emAlta, setEmAlta]         = useState<Musica[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get(musicasUrl('/em-alta'))
      .then(res => setEmAlta(res.data))
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p>Carregando...</p>;

  return (
    <div>
      <Link to="/">Voltar</Link>

      <h1>Musicas em Alta</h1>
      <ul>
        {emAlta.map(musica => (
          <li key={musica.id}>
            <strong>{musica.titulo}</strong>
            {' - '}
            {musica.artistas.map(a => a.nomeArtistico).join(', ')}
            {' - '}
            {musica.reproducoes} reproducoes
          </li>
        ))}
      </ul>
    </div>
  );
}