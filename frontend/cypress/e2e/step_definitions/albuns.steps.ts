import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const API = 'http://localhost:3000/api';

Before(() => {
  cy.request({ method: 'GET', url: `${API}/albuns`, failOnStatusCode: false })
    .then(({ body, status }) => {
      if (status !== 200 || !Array.isArray(body)) return;
      const albunsParaLimpar = ['Four Seasons', 'Le quattro stagioni'];
      body
        .filter((a: any) => albunsParaLimpar.includes(a.nome))
        .forEach((a: any) => {
          cy.request({ method: 'DELETE', url: `${API}/albuns/${a.id}`, failOnStatusCode: false });
        });
    });
});

// ─── Given ───────────────────────────────────────────────────────────────────

Given('estou logado como {string} com login {string}', (tipo: string, login: string) => {
  cy.visit('/login');
  cy.get('input[name="login"]').type(login);
  cy.get('input[name="password"]').type('1234'); 
  cy.get('button[type="submit"]').click();
});

Given('existe um álbum chamado {string} publicado por {string} com ID {string} e gênero {string}',
  (nome: string, artista: string, _id: string, genero: string) => {
    cy.request({
      method: 'POST',
      url: `${API}/albuns`,
      body: { nome, artista, data: '2026-01-01', generos: [genero], musicas: [{ titulo: 'Temp' }] },
      failOnStatusCode: false,
    });
  }
);

Given('as músicas do álbum de ID {string} são {string} de índice {string} e {string} de índice {string}',
  (_id: string, _mus1: string, _idx1: string, _mus2: string, _idx2: string) => {
    // precondição de dados — sem endpoint de álbuns no backend ainda
  }
);

// ─── When ────────────────────────────────────────────────────────────────────

When('tento alterar o nome do álbum de ID {string} para {string} e o gênero para {string}',
  (id: string, novoNome: string, novoGenero: string) => {
    cy.visit(`/albuns/editar/${id}`);
    cy.get('input[name="nome"]').clear().type(novoNome);
    cy.get('input[name="genero"]').clear().type(novoGenero);
    cy.contains('button', 'Salvar').click();
  }
);

When('tento publicar um álbum chamado {string} de ID {string}, com gênero {string}, data de lançamento {string}, contendo as músicas {string} com arquivo {string} e {string} com arquivo {string}',
  (nome: string, _id: string, gen: string, _data: string, mus1: string, _arq1: string, _mus2: string, _arq2: string) => {
    cy.visit('/albuns/novo');
    cy.get('input[name="nome"]').type(nome);
    cy.get('input[name="genero"]').type(gen);
    cy.get('input[name="musica"]').type(mus1);
    cy.contains('button', 'Adicionar').click();
    cy.get('.btn-cadastrar').click();
  }
);

// ─── Then ────────────────────────────────────────────────────────────────────

Then('o álbum {string} contendo as músicas {string} e {string} deve ser indexado na plataforma',
  (nome: string, _mus1: string, _mus2: string) => {
    cy.visit('/albuns');
    cy.contains(new RegExp(`^${nome}$`)).should('be.visible');
  }
);

Then('existe um álbum chamado {string} publicado por {string} com ID {string} e gênero {string}',
  (nome: string, artista: string, id: string, genero: string) => {
    // 1. Valida se o álbum aparece na interface
    cy.visit('/albuns');
    cy.contains(nome).should('be.visible');

    // 2. Valida se os dados foram realmente salvos no backend
    cy.request(`${API}/albuns/${id}`)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.id).to.equal(parseInt(id));
        expect(response.body.nome).to.equal(nome);
        expect(response.body.generos).to.include(genero);
      });
  }
);

Then('eu vejo uma mensagem de sucesso {string}', (mensagem: string) => {
  cy.contains('.success', mensagem).should('be.visible');
});
