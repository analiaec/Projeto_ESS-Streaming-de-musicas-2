import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

// URL base 
const apiUrl = () => 'http://localhost:3001/api';

// Limpeza inicial: remove álbuns de teste antes de rodar
Before(() => {
  cy.request('GET', `${apiUrl()}/albuns`).then(({ body }) => {
    const albunsParaLimpar = ['Four Seasons', 'Le quattro stagioni'];
    body.filter((a: any) => albunsParaLimpar.includes(a.nome)).forEach((a: any) => {
      cy.request('DELETE', `${apiUrl()}/albuns/${a.id}`, { failOnStatusCode: false });
    });
  });
});

// LOGIN 
Given('estou logado como {string} com login {string}', function (_perfil: string, login: string) {
  cy.visit('/');
  cy.contains('a', 'Login').click();
  cy.get('.campo-login').clear().type(login);
  cy.get('.campo-senha').clear().type('1234', { log: false });
  cy.contains('button', 'Entrar').click();
});

// CENÁRIO: Edição (regra do stakeholder)
Given('existe um álbum chamado {string} publicado por {string} com ID {string} e gênero {string}', function (nome, artista, id, genero) {
  // POST cy.request para garantir que o álbum existe no banco
  cy.request('POST', `${apiUrl()}/albuns`, { nome, artista, data: '2026-01-01', generos: [genero], musicas: [{titulo: 'Temp'}] });
});

When('tento alterar o nome do álbum de ID {string} para {string} e o gênero para {string}', function (id, novoNome, novoGenero) {
  cy.visit(`/albuns/editar/${id}`);
  cy.get('input[name="nome"]').clear().type(novoNome);
  cy.get('input[name="genero"]').clear().type(novoGenero);
  cy.contains('button', 'Salvar').click();
});

// CENÁRIO: Cadastro
When('tento publicar um álbum chamado {string} de ID {string}, com gênero {string}, data de lançamento {string}, contendo as músicas {string} com arquivo {string} e {string} com arquivo {string}', 
function (nome, id, gen, data, mus1, arq1, mus2, arq2) {
  cy.visit('/albuns/novo');
  cy.get('input[name="nome"]').type(nome);
  cy.get('input[name="genero"]').type(gen);
  // Simula a adição dinâmica de músicas
  cy.get('input[name="musica"]').type(mus1);
  cy.contains('button', 'Adicionar').click();
  cy.get('.btn-cadastrar').click();
});

// VALIDAÇÕES
Then('o álbum {string} contendo as músicas {string} e {string} deve ser indexado na plataforma', function (nome, mus1, mus2) {
  cy.visit('/albuns');
  cy.contains(nome).should('be.visible');
});

Then('eu vejo uma mensagem de sucesso {string}', function (mensagem: string) {
  cy.contains('.success, .message', mensagem).should('be.visible');
});
