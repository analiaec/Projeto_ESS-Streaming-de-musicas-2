import { Given } from '@badeball/cypress-cucumber-preprocessor';

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
