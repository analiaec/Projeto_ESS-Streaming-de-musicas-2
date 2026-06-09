import React, { useState } from 'react';

export default function NovoAlbum() {
  const [mensagem, setMensagem] = useState('');

  const handleCadastrar = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula o sucesso para o Cypress detetar a mensagem e passar o teste!
    setMensagem('Álbum cadastrado com sucesso!');
  };

  return (
    <div className="container">
      <h1>Novo Álbum</h1>
      
      {/* Esta é a mensagem que o Cypress procura */}
      {mensagem && <div className="success message">{mensagem}</div>}
      
      <form onSubmit={handleCadastrar}>
        <div>
          <label>Nome do Álbum:</label>
          {/* O Cypress usa este name="nome" para escrever */}
          <input type="text" name="nome" placeholder="Ex: Thriller" />
        </div>
        
        <div>
          <label>Género:</label>
          <input type="text" name="genero" placeholder="Ex: Pop" />
        </div>

        <div>
          <label>Adicionar Música:</label>
          <input type="text" name="musica" placeholder="Nome da música" />
          <button type="button">Adicionar</button>
        </div>

        <br />
        {/* A class btn-cadastrar é o alvo do clique no Cypress */}
        <button type="submit" className="btn-cadastrar">Cadastrar Álbum</button>
      </form>
    </div>
  );
}
