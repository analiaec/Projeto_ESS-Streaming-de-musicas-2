import { useState } from 'react';
import { api, musicasUrl } from '../api';
import { Musica }          from '../types';

export function Busca() {
  const [termo,      setTermo]      = useState('');
  const [genero,     setGenero]     = useState('');
  const [artista,    setArtista]    = useState('');
  const [ano,        setAno]        = useState('');
  const [resultados, setResultados] = useState<Musica[]>([]);
  const [buscou,     setBuscou]     = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function buscar() {
    const params = new URLSearchParams();
    if (termo)   params.append('termo',   termo);
    if (genero)  params.append('genero',  genero);
    if (artista) params.append('artista', artista);
    if (ano)     params.append('ano',     ano);

    setCarregando(true);
    setBuscou(false);

    try {
      const res = await api.get(musicasUrl(`?${params.toString()}`));
      setResultados(res.data);
    } catch (erro) {
      setResultados([]);
    } finally {
      setCarregando(false);
      setBuscou(true);
    }
  }

  return (
    <div>
      <h1>Busca</h1>

      {/* Campo de busca por nome */}
      <div>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={termo}
          onChange={e => setTermo(e.target.value)}
        />
      </div>

      {/* Filtros */}
      <div>
        <select value={genero} onChange={e => setGenero(e.target.value)}>
          <option value="">Todos os generos</option>
          <option value="MPB">MPB</option>
          <option value="Bossa Nova">Bossa Nova</option>
          <option value="Samba">Samba</option>
          <option value="Pop">Pop</option>
          <option value="Axe">Axe</option>
        </select>

        <input
          type="text"
          placeholder="Filtrar por artista..."
          value={artista}
          onChange={e => setArtista(e.target.value)}
        />

        <input
          type="number"
          placeholder="Ano de lancamento..."
          value={ano}
          onChange={e => setAno(e.target.value)}
        />
      </div>

      {/* Botão de busca */}
      <button onClick={buscar}>Buscar</button>

      {/* Resultados */}
      {carregando && <p>Carregando...</p>}

      {buscou && resultados.length === 0 && (
        <p>Nenhum resultado encontrado.</p>
      )}

      {resultados.length > 0 && (
        <ul>
          {resultados.map(musica => (
            <li key={musica.id}>
              <strong>{musica.titulo}</strong>
              {' - '}
              {musica.artistas.map(a => a.nomeArtistico).join(', ')}
              {' - '}
              {musica.genero}
              {' - '}
              {musica.ano}
              {' - '}
              {musica.reproducoes} reproducoes
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}