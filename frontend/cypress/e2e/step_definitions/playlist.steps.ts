import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const seedLogin = 'LuisCardoso012';
const seedPassword = '1234';
let currentLogin = seedLogin;

function apiUrl() {
  return 'http://localhost:3000/api';
}

function normalizePlaylists(body: unknown): any[] {
  if (Array.isArray(body)) {
    return body;
  }

  if (body && typeof body === 'object' && 'value' in body && Array.isArray((body as any).value)) {
    return (body as any).value;
  }

  return [];
}

function loginWithUi(login: string) {
  cy.visit('/');
  cy.contains('a', 'Login').click();
  cy.get('.campo-login').clear().type(login);
  cy.get('.campo-senha').clear().type(seedPassword, { log: false });
  cy.contains('button', 'Entrar').click();
  cy.contains('h1', `Olá, ${login}!`).should('be.visible');
}

function fillPlaylistForm(nome: string, descricao: string, visibilidade: string) {
  cy.get('input[placeholder="Nome da playlist"]').clear();
  if (nome) {
    cy.get('input[placeholder="Nome da playlist"]').type(nome);
  }

  cy.get('input[placeholder="Descrição (opcional)"]').clear();
  if (descricao) {
    cy.get('input[placeholder="Descrição (opcional)"]').type(descricao);
  }

  cy.get('select').select(visibilidade === 'Pública' ? 'publica' : 'privada');
}

function clickSavePlaylist() {
  cy.contains('button', /Criar playlist|Atualizar playlist/).click();
}

function removePlaylistsByName(names: string[]) {
  return cy.request('GET', `${apiUrl()}/playlists`).then(({ body }) => {
    const playlists = normalizePlaylists(body);
    const ids = playlists
      .filter((playlist: any) => names.includes(playlist.nome))
      .map((playlist: any) => playlist.id);

    return cy.wrap(ids).each((id) => {
      return cy.request({
        method: 'DELETE',
        url: `${apiUrl()}/playlists/${id}`,
        failOnStatusCode: false,
      });
    });
  });
}

function getPlaylists() {
  return cy.request('GET', `${apiUrl()}/playlists`).then(({ body }) => normalizePlaylists(body));
}

function ensurePlaylistExists(nome: string) {
  return removePlaylistsByName([nome]).then(() => {
    fillPlaylistForm(nome, 'Melhores musicas', 'Pública');
    clickSavePlaylist();
    cy.contains('.playlist-card h3', nome).should('be.visible');
  });
}

function ensurePlaylistExistsForOwner(nome: string, ownerLogin: string, publica = true) {
  return removePlaylistsByName([nome]).then(() => {
    return cy.request('POST', `${apiUrl()}/playlists`, {
      nome,
      descricao: 'Melhores musicas',
      publica,
      ownerLogin,
    });
  });
}

Before(() => {
  currentLogin = seedLogin;
  return removePlaylistsByName([
    'Músicas de rock 2026',
    'Músicas de rock 2026 Atualizada',
    'Músicas de rock 2026 Duplicada',
    'Playlist privada 2026',
    'Playlist temporária 2026',
    'Playlist de outro usuário',
  ]);
});

Given('estou logado como {string} com login {string}', function (_perfil: string, login: string) {
  currentLogin = login;
  loginWithUi(login);
});

Given('a playlist {string} já existe', function (nome: string) {
  return ensurePlaylistExists(nome);
});

Given('o usuário está na página {string}', function (pagina: string) {
  if (pagina.toLowerCase() === 'playlists') {
    cy.contains('a', 'Playlists').click();
    cy.contains('h2', 'Playlists').should('be.visible');
    return;
  }

  throw new Error(`Página não suportada: ${pagina}`);
});

When('o usuário seleciona a opção {string}', function (opcao: string) {
  if (opcao === 'Criar Playlist') {
    cy.contains('button', 'Criar playlist').should('be.visible');
    return;
  }

  if (opcao === 'Atualizar') {
    cy.contains('button', 'Atualizar playlist').should('be.visible');
    return;
  }

  throw new Error(`Opção não suportada: ${opcao}`);
});

When(/^o usuário preenche o nome com "([^"]*)", a descrição com "([^"]*)"\s*,?\s*a visibilidade como "([^"]*)"$/, function (nome: string, descricao: string, visibilidade: string) {
  fillPlaylistForm(nome, descricao, visibilidade);
  clickSavePlaylist();
});

When('o usuário seleciona os três pontos ao lado do nome {string}', function (nome: string) {
  cy.contains('.playlist-card', nome).within(() => {
    cy.contains('button', 'Atualizar').click();
  });
});

When('o usuário seleciona o botão {string} da playlist {string}', function (botao: string, nome: string) {
  if (botao !== 'Excluir') {
    throw new Error(`Botão não suportado: ${botao}`);
  }

  cy.on('window:confirm', () => true);

  cy.contains('.playlist-card', nome).within(() => {
    cy.contains('button', 'Excluir').click();
  });
});

When('o usuário cancela a exclusão da playlist {string}', function (nome: string) {
  cy.on('window:confirm', () => false);

  cy.contains('.playlist-card', nome).within(() => {
    cy.contains('button', 'Excluir').click();
  });
});

When('o usuário muda o nome para {string}', function (novoNome: string) {
  cy.get('input[placeholder="Nome da playlist"]').clear().type(novoNome);
  clickSavePlaylist();
});

Given('existe uma playlist de outro usuário chamada {string}', function (nome: string) {
  return ensurePlaylistExistsForOwner(nome, 'OutroUsuario', true).then(() => {
    cy.go('back');
    cy.contains('a', 'Playlists').click();
    cy.contains('h2', 'Playlists').should('be.visible');
  });
});

Given('existe uma segunda playlist chamada {string}', function (nome: string) {
  return ensurePlaylistExists(nome).then(() => {
    cy.go('back');
    cy.contains('a', 'Playlists').click();
    cy.contains('h2', 'Playlists').should('be.visible');
  });
});

Given('existe uma playlist chamada {string}', function (nome: string) {
  return ensurePlaylistExists(nome).then(() => {
    cy.go('back');
    cy.contains('a', 'Playlists').click();
    cy.contains('h2', 'Playlists').should('be.visible');
  });
});

Then('o usuário consegue ver a playlist com o nome {string}', function (nome: string) {
  cy.contains('.playlist-card h3', nome).should('be.visible');
});

Then('eu vejo a playlist {string} como {string}', function (nome: string, visibilidade: string) {
  cy.contains('.playlist-card', nome).within(() => {
    cy.contains('.playlist-visibility', visibilidade).should('be.visible');
  });
});

Then('a playlist {string} não deve aparecer na lista', function (nome: string) {
  cy.contains('.playlist-card', nome).should('not.exist');
});

Then('a playlist {string} deve permanecer na lista', function (nome: string) {
  cy.contains('.playlist-card', nome).should('be.visible');
});

Then('a playlist {string} deve existir somente uma vez', function (nome: string) {
  return getPlaylists().then((playlists) => {
    const matches = playlists.filter((playlist: any) => playlist.nome === nome);
    expect(matches.length).to.eq(1);
  });
});

Then('a playlist {string} deve ser renomeada para {string}', function (nomeAntigo: string, nomeNovo: string) {
  return getPlaylists().then((playlists) => {
    const nomes = playlists.map((playlist: any) => playlist.nome);
    expect(nomes).to.include(nomeNovo);
    expect(nomes).to.not.include(nomeAntigo);
  });
});

Then('eu não vejo os botões {string} e {string} na playlist {string}', function (botao1: string, botao2: string, nome: string) {
  cy.contains('.playlist-card', nome).within(() => {
    cy.contains('button', botao1).should('not.exist');
    cy.contains('button', botao2).should('not.exist');
  });
});

Then('o usuário ainda está na página {string}', function (pagina: string) {
  if (pagina.toLowerCase() !== 'playlists') {
    throw new Error(`Página não suportada: ${pagina}`);
  }

  cy.url().should('include', '/playlists');
});

Then('eu vejo uma mensagem de sucesso{string}', function (mensagem: string) {
  cy.contains('.success', mensagem).should('be.visible');
});

Then('eu vejo uma mensagem de erro{string}', function (mensagem: string) {
  cy.contains('.error', mensagem).should('be.visible');
});