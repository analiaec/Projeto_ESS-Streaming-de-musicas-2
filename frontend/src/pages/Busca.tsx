import { useState }        from 'react';
import { Link }            from 'react-router-dom';
import { api, musicasUrl } from '../api';
import { Musica }          from '../types';
import { MusicaCard }      from '../components/MusicaCard';
import { useAuth } from '../contexts/AuthContext';
import './Busca.css';

export function Busca() {
  const [termo,      setTermo]      = useState('');
  const [genero,     setGenero]     = useState('');
  const [artista,    setArtista]    = useState('');
  const [ano,        setAno]        = useState('');
  const [resultados, setResultados] = useState<Musica[]>([]);
  const [buscou,     setBuscou]     = useState(false);
  const [carregando, setCarregando] = useState(false);
  const { login, logado, role, sair } = useAuth();

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

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') buscar();
  }

  return (
    <div className="busca-container">
      <div className="home-header">
        {logado
          ? <h1>Olá, {login}!</h1>
          : <h1>Faça login</h1>
        }
        {logado
          ? <button className="home-btn-outline" onClick={sair}>Sair</button>
          : <Link to="/login" className="home-btn-outline">Login</Link>
        }
      </div>
      <div className="busca-header">
        <Link to="/" className="busca-voltar">Voltar</Link>
        <h1 className="busca-titulo">Busca</h1>
      </div>

      <div className="busca-filtros">
        <input
          className="busca-input"
          type="text"
          placeholder="Buscar por nome..."
          value={termo}
          onChange={e => setTermo(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="busca-filtros-linha">
          <select
            className="busca-select"
            value={genero}
            onChange={e => setGenero(e.target.value)}
          >
            <option value="">Gênero</option>
            <option value="MPB">MPB</option>
            <option value="Bossa Nova">Bossa Nova</option>
            <option value="Samba">Samba</option>
            <option value="Pop">Pop</option>
            <option value="Axé">Axé</option>
          </select>

          <input
            className="busca-input"
            type="text"
            placeholder="Filtrar por artista..."
            value={artista}
            onChange={e => setArtista(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <input
            className="busca-input"
            type="number"
            placeholder="Ano de lancamento..."
            value={ano}
            onChange={e => setAno(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button className="busca-btn" onClick={buscar}>
          Buscar
        </button>
      </div>

      {carregando && <p>Carregando...</p>}

      {buscou && resultados.length === 0 && (
        <p className="busca-vazio">Nenhum resultado encontrado.</p>
      )}

      {resultados.length > 0 && (
        <ul className="busca-lista">
          {resultados.map(musica => (
            <MusicaCard key={musica.id} musica={musica} />
          ))}
        </ul>
      )}
    </div>
  );
}