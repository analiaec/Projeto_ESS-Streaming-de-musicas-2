import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const seedPassword = '1234'; 

function apiUrl() {
  return 'http://localhost:3000/api'; // Atualiza
}

function loginWithUi(login: string) {
  cy.visit('/');
  cy.request({
    method: 'POST',
    url: `${apiUrl()}/auth/login`,
    body: { login, password: seedPassword },
    failOnStatusCode: true,
  }).then((response) => {
    const { access_token, role } = response.body;
    cy.window().then((win) => {
      win.localStorage.setItem('wv_login', login);
      win.localStorage.setItem('wv_token', access_token);
      win.localStorage.setItem('wv_role', role);
    });
  });
  cy.reload();
  cy.contains('h1', `Olá, ${login}!`).should('be.visible'); // Atualiza
}

// Limpeza inicial: remove álbuns de teste antes de rodar
Before(() => {
  cy.request('GET', `${apiUrl()}/albuns`).then(({ body }) => {
    const albunsParaLimpar = ['Four Seasons', 'Le quattro stagioni'];
    body.filter((a: any) => albunsParaLimpar.includes(a.nome)).forEach((a: any) => {
      cy.request('DELETE', `${apiUrl()}/albuns/${a.id}`, { failOnStatusCode: false });
    });
  });
});

// ── Given ──────────────────────────────────────────────────────────────────

Given('estou logado como {string} com login {string}', function (_perfil: string, login: string) {
  loginWithUi(login);
});

// CENÁRIO: Edição (Garante a regra do stakeholder)
Given('existe um álbum chamado {string} publicado por {string} com ID {string} e gênero {string}', function (nome, artista, id, genero) {
  // POST via cy.request para garantir o setup rápido
  cy.request('POST', `${apiUrl()}/albuns`, { nome, artista, data: '2026-01-01', generos: [genero], musicas: [{titulo: 'Temp'}] });
});

// ── When ───────────────────────────────────────────────────────────────────

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

// ── Then ───────────────────────────────────────────────────────────────────

Then('o álbum {string} contendo as músicas {string} e {string} deve ser indexado na plataforma', function (nome, mus1, mus2) {
  cy.visit('/albuns');
  // Usando Regex exata, caso eles tenham mudado as lógicas de busca
  const exactMatch = new RegExp(`^${nome}$`);
  cy.contains(exactMatch).should('be.visible');
});

Then('eu vejo uma mensagem de sucesso {string}', function (mensagem: string) {
  cy.contains('.success, .message', mensagem).should('be.visible');
});
