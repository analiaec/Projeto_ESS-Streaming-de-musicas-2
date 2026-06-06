import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div>
      <h1>Pagina Inicial</h1>

      <button onClick={() => {}}>
        <Link to="/em-alta">Ver Musicas em Alta</Link>
      </button>

      <button onClick={() => {}}>
        <Link to="/busca">Buscar Musicas</Link>
      </button>
    </div>
  );
}