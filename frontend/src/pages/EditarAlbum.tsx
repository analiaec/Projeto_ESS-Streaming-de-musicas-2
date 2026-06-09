import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function EditarAlbum() {
  const { id } = useParams<{ id: string }>(); 
  const [mensagem, setMensagem] = useState('');

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('Álbum atualizado com sucesso!');
  };

  return (
    <div className="container">
      <h1>Editar Álbum {id}</h1>
      
      {mensagem && <div className="success message">{mensagem}</div>}

      <form onSubmit={handleSalvar}>
        <div>
          <label>Nome do Álbum:</label>
          <input type="text" name="nome" />
        </div>
        
        <div>
          <label>Género:</label>
          <input type="text" name="genero" />
        </div>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
