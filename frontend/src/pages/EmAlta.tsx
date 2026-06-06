import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { api, musicasUrl }     from '../api';
import { Musica }              from '../types';
import { MusicaCard }          from '../components/MusicaCard';
import './EmAlta.css';

export function EmAlta() {
  const [emAlta, setEmAlta]         = useState<Musica[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    api.get(musicasUrl('/em-alta'))
      .then(res => setEmAlta(res.data))
      .finally(() => setCarregando(false));
  }, []);

  // incrementa reproduções da música específica no estado local
  function handleReproduzir(id: number) {
    setEmAlta(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, reproducoes: m.reproducoes + 1 }
          : m
      )
    );
  }

  if (carregando) return <p>Carregando...</p>;

  return (
    <div className="emalta-container">
        <div className="emalta-header">
        <Link to="/" className="emalta-voltar">Voltar</Link>
        <h1 className="emalta-titulo">Músicas em Alta</h1>
        </div>
        <ul className="emalta-lista">
            {emAlta.map((musica, index) => (
                <MusicaCard
                key={musica.id}
                musica={musica}
                exibirReproducoes={true}
                onReproduzir={handleReproduzir}
                posicao={index + 1}  // ← passa a posição (começa em 1)
                />
            ))}
            </ul>
    </div>
    );
}