import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const API = 'http://localhost:3000/api';

// Passwords stored per login during scenario setup, reset before each scenario
const userPasswords: Record<string, string> = {};

// ── Page URL map ─────────────────────────────────────────────────────────────

const PAGE_URLS: Record<string, string> = {
  'Cadastro':           '/auth/register',
  'Home':               '/',
  'Configurações':      '/conta',
  'Atualizar Conta':    '/update-account',
  'Remover Conta':      '/remove-account',
  'Login':              '/login',
  'Gerenciar Usuários': '/admin/users',
};

function pageUrl(name: string): string {
  return PAGE_URLS[name] ?? `/${name.toLowerCase().replace(/\s+/g, '-')}`;
}

// ── Before ───────────────────────────────────────────────────────────────────

/**
 * Deletes a user via API using their own token.
 * Tries each candidate password in order; stops on first successful login.
 */
function deleteViaOwnToken(login: string, passwords: string[]) {
  const [first, ...rest] = passwords;
  cy.request({
    method: 'POST',
    url: `${API}/auth/login`,
    body: { login, password: first },
    failOnStatusCode: false,
  }).then(({ body }) => {
    if (body?.access_token) {
      cy.request({
        method: 'DELETE',
        url: `${API}/users/${login}`,
        headers: { Authorization: `Bearer ${body.access_token}` },
        body: { password: first },
        failOnStatusCode: false,
      });
    } else if (rest.length) {
      deleteViaOwnToken(login, rest);
    }
  });
}

Before(() => {
  Object.keys(userPasswords).forEach(k => delete userPasswords[k]);

  // Login as admin first; use admin token to delete Carlos1 (admin never needs
  // the target user's password), then delete admin itself.
  cy.request({
    method: 'POST',
    url: `${API}/auth/login`,
    body: { login: 'admin', password: 'admin123' },
    failOnStatusCode: false,
  }).then(({ body }) => {
    if (body?.access_token) {
      const adminToken = body.access_token;
      // Admin can delete any user without that user's password.
      // Admin itself is a seeded fixture (database.seed.ts) — never delete it.
      cy.request({
        method: 'DELETE',
        url: `${API}/users/Carlos1`,
        headers: { Authorization: `Bearer ${adminToken}` },
        failOnStatusCode: false,
      });
    } else {
      // Admin doesn't exist; try to delete Carlos1 directly.
      // Try both the original and the updated password (a previous test may
      // have changed it via the "Atualização de informações" scenario).
      deleteViaOwnToken('Carlos1', ['Senhasupersecreta1!', 'Senhasupersecreta2!']);
    }
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function deleteUserIfExists(login: string, password: string) {
  return cy.request({
    method: 'POST',
    url: `${API}/auth/login`,
    body: { login, password },
    failOnStatusCode: false,
  }).then(({ body }) => {
    if (body?.access_token) {
      return cy.request({
        method: 'DELETE',
        url: `${API}/users/${login}`,
        headers: { Authorization: `Bearer ${body.access_token}` },
        body: { password },
        failOnStatusCode: false,
      });
    }
  });
}

function createUserViaApi(userData: Record<string, string>) {
  return cy.request({
    method: 'POST',
    url: `${API}/auth/register`,
    body: {
      login:       userData.login.trim(),
      name:        userData.name.trim(),
      password:    userData.password.trim(),
      email:       userData.email.trim(),
      tipodeconta: userData.tipodeconta.trim(),
    },
    failOnStatusCode: false,
  });
}

function authenticateViaApi(login: string, password: string) {
  cy.visit('/');
  cy.request({
    method: 'POST',
    url: `${API}/auth/login`,
    body: { login, password },
  }).then(({ body }) => {
    cy.window().then(win => {
      win.localStorage.setItem('wv_login', login);
      win.localStorage.setItem('wv_token', body.access_token);
      win.localStorage.setItem('wv_role',  body.role);
    });
  });
  cy.reload();
}

function fillField(field: string, value: string) {
  const key = field.toLowerCase().trim();

  switch (key) {
    case 'login':
      cy.contains('label.form-label', /Login/i)
        .closest('.form-group')
        .find('input')
        .clear();
      if (value) {
        cy.contains('label.form-label', /Login/i)
          .closest('.form-group')
          .find('input')
          .type(value);
      }
      break;

    case 'name':
      cy.contains('label.form-label', /Nome/i)
        .closest('.form-group')
        .find('input')
        .clear();
      if (value) {
        cy.contains('label.form-label', /Nome/i)
          .closest('.form-group')
          .find('input')
          .type(value);
      }
      break;

    case 'email':
      cy.contains('label.form-label', /E-mail|Email/i)
        .closest('.form-group')
        .find('input')
        .clear();
      if (value) {
        cy.contains('label.form-label', /E-mail|Email/i)
          .closest('.form-group')
          .find('input')
          .type(value);
      }
      break;

    case 'password':
      cy.contains('label.form-label', /Senha/i)
        .closest('.form-group')
        .find('input[type="password"]')
        .first()
        .clear();
      if (value) {
        cy.contains('label.form-label', /Senha/i)
          .closest('.form-group')
          .find('input[type="password"]')
          .first()
          .type(value);
      }
      break;

    case 'tipodeconta':
      cy.get('body').then($body => {
        if ($body.find('.tipo-btn').length) {
          // Buttons show "Ouvinte"/"Artista"/"Podcaster"; feature uses "OUVINTE"/"ARTISTA"/"PODCASTER"
          cy.contains('.tipo-btn .tipo-label', new RegExp(value, 'i')).closest('.tipo-btn').click();
        } else {
          cy.get('select').first().select(value);
        }
      });
      break;
  }
}

// ── Given ────────────────────────────────────────────────────────────────────

Given('existe uma conta cadastrada com os dados:', (dataTable: any) => {
  const userData = dataTable.hashes()[0];
  const login    = userData.login.trim();
  const password = userData.password.trim();
  userPasswords[login] = password;

  // ADMIN accounts are seeded by the backend (database.seed.ts) and cannot be
  // registered via the public API endpoint — just record the password and move on.
  if (userData.tipodeconta.trim().toUpperCase() === 'ADMIN') return;

  deleteUserIfExists(login, password).then(() => createUserViaApi(userData));
});

Given('existe uma conta já cadastrada com o Login {string}', (login: string) => {
  const password = 'Senhasupersecreta1!';
  userPasswords[login] = password;
  cy.request({
    method: 'POST',
    url: `${API}/auth/register`,
    body: { login, name: 'Carlos', password, email: 'carlos@gmail.com', tipodeconta: 'OUVINTE' },
    failOnStatusCode: false,
  });
});

Given('o usuário {string} está autenticado', (login: string) => {
  const password = userPasswords[login] ?? (login === 'admin' ? 'admin123' : '1234');
  authenticateViaApi(login, password);
});

Given('o usuário está na página de {string}', (pageName: string) => {
  cy.visit(pageUrl(pageName));
});

// ── When ─────────────────────────────────────────────────────────────────────

When('o usuário preenche os campos com:', (dataTable: any) => {
  const row = dataTable.hashes()[0];
  Object.entries(row).forEach(([field, rawValue]) => {
    fillField(field, (rawValue as string).trim());
  });
});

When('o usuário clica no botão de {string}', (buttonName: string) => {
  switch (buttonName) {
    case 'Editar dados':
      cy.contains('a', 'Editar dados').click();
      break;

    case 'Excluir conta':
      cy.contains('a', 'Excluir conta').click();
      break;

    default:
      cy.contains('button', buttonName).click();
  }
});

When('o usuário seleciona {string} para a conta de login {string}', (action: string, login: string) => {
  if (action === 'Excluir') {
    cy.on('window:confirm', () => true);
  }
  cy.contains('td', login)
    .closest('tr')
    .contains('button', action)
    .click();
});

When('o usuário cancela a remoção de {string}', (login: string) => {
  cy.on('window:confirm', () => false);
  cy.contains('td', login)
    .closest('tr')
    .contains('button', 'Excluir')
    .click();
});

When('o usuário acessa a página de {string}', (pageName: string) => {
  cy.visit(pageUrl(pageName));
});

// ── Then ─────────────────────────────────────────────────────────────────────

Then('o usuário deve ver a mensagem de confirmação {string}', (message: string) => {
  cy.contains('.toast-message', message).should('be.visible');
});

Then('o usuário deve ver a mensagem de erro {string}', (message: string) => {
  // API errors render in toast; frontend validation errors render in .alert.alert-error
  cy.contains('.toast-message, .alert.alert-error', message).should('be.visible');
});

Then('o usuário deve ser redirecionado para a página de {string}', (pageName: string) => {
  const url = pageUrl(pageName);
  if (url === '/') {
    cy.url().should('match', /localhost:\d+(\/)?(\?.*)?$/);
  } else {
    cy.url().should('include', url);
  }
});

Then('o usuário continua na página de {string}', (pageName: string) => {
  cy.url().should('include', pageUrl(pageName));
});

Then('o formulário não é enviado com sucesso', () => {
  cy.get('.toast-success').should('not.exist');
});

Then('o usuário deve ver os dados da conta:', (dataTable: any) => {
  const expected = dataTable.hashes()[0];
  const login = expected.login?.trim();

  cy.window().then(win => {
    const token = win.localStorage.getItem('wv_token');
    cy.request({
      method: 'GET',
      url: `${API}/users/${login}`,
      headers: { Authorization: `Bearer ${token}` },
    }).then(({ body }) => {
      if (expected.name?.trim())        expect(body.name).to.eq(expected.name.trim());
      if (expected.email?.trim())       expect(body.email).to.eq(expected.email.trim());
      if (expected.tipodeconta?.trim()) expect(body.tipodeconta?.trim()).to.eq(expected.tipodeconta.trim());
      // password is hashed server-side; use "deve conseguir autenticar com a nova senha" to verify it
    });
  });
});

Then('o usuário deve conseguir autenticar com a nova senha {string}', (newPassword: string) => {
  cy.window().then(win => {
    const login = win.localStorage.getItem('wv_login');
    cy.request({
      method: 'POST',
      url: `${API}/auth/login`,
      body: { login, password: newPassword },
      failOnStatusCode: false,
    }).then(({ body }) => {
      expect(body.access_token).to.exist;
    });
  });
});

Then('o usuário não está mais autenticado no sistema', () => {
  cy.window().then(win => {
    expect(win.localStorage.getItem('wv_token')).to.be.null;
    expect(win.localStorage.getItem('wv_login')).to.be.null;
  });
});

Then('a conta de login {string} não deve mais aparecer na tabela de usuários', (login: string) => {
  cy.get('.admin-table').should('not.contain', login);
});

Then('a conta de login {string} deve continuar na tabela de usuários', (login: string) => {
  cy.get('.admin-table').should('contain', login);
});

Then('o usuário não deve visualizar a opção {string}', (option: string) => {
  cy.contains('.home-card-label', option).should('not.exist');
});
