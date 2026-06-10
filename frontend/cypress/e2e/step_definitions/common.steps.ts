import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const API = 'http://localhost:3000/api';

export function loginViaApi(login: string) {
  const password = login === 'admin' ? 'admin123' : '1234';
  cy.visit('/');
  cy.request({
    method: 'POST',
    url: `${API}/auth/login`,
    body: { login, password },
    failOnStatusCode: true,
  }).then(({ body }) => {
    cy.window().then(win => {
      win.localStorage.setItem('wv_login', login);
      win.localStorage.setItem('wv_token', body.access_token);
      win.localStorage.setItem('wv_role', body.role);
    });
  });
  cy.reload();
  cy.contains('h1', `Olá, ${login}!`).should('be.visible');
}

Given('estou logado como {string} com login {string}', (_tipo: string, login: string) => {
  loginViaApi(login);
});

Given('o usuário está na página {string}', (pagina: string) => {
  cy.visit(`/${pagina}`);
});


// ─── Navegação ────────────────────────────────────────────────────────────────

Given('estou na página inicial', () => {
  cy.visit('/');
});

Given('eu estou na página inicial', () => {
  cy.visit('/');
});

Given('não estou logado na plataforma', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

Given('estou logado com login {string} e senha {string}',
  (login: string, senha: string) => {
    cy.visit('/login');
    cy.get('input[placeholder="seu_login"]').type(login);
    cy.get('input[type="password"]').type(senha);
    cy.get('button.auth-submit').click();
    cy.url().should('include', '/');
  }
);

Given('estou logado como {string} com login {string} e senha {string}',
  (_perfil: string, login: string, senha: string) => {
    cy.visit('/login');
    cy.get('input[placeholder="seu_login"]').type(login);
    cy.get('input[type="password"]').type(senha);
    cy.get('button.auth-submit').click();
    cy.url().should('not.include', '/login');
    cy.url().should('eq', 'http://localhost:3001/');
  }
);


Then('devo ver a mensagem {string}', (mensagem: string) => {
  cy.contains(mensagem).should('be.visible');
});

Then('deve aparecer a mensagem {string} na tela', (mensagem: string) => {
  cy.contains(mensagem).should('be.visible');
});

Then('devo ver o botão {string}', (texto: string) => {
  cy.contains(texto).should('be.visible');
});

Then('não devo ver o botão {string}', (texto: string) => {
  cy.contains(texto).should('not.exist');
});

Then('devo ver o card {string}', (label: string) => {
  cy.contains(label).should('be.visible');
});

Then('devo ver a seção {string}', (secao: string) => {
  cy.contains(secao).should('be.visible');
});

Then('não devo ver a seção {string}', (secao: string) => {
  cy.contains(secao).should('not.exist');
});

Then('devo ver a saudação {string}', (saudacao: string) => {
  cy.contains(saudacao).should('be.visible');
});

Then('os resultados devem ter no máximo 10 músicas', () => {
  cy.get('.musica-item').should('have.length.lessThan', 11);
});

Then('nenhum item deve ser exibido na lista de resultados', () => {
  cy.get('.musica-item').should('not.exist');
});

Then('devo ver músicas listadas na tela', () => {
  cy.get('.musica-item').should('have.length.greaterThan', 0);
});