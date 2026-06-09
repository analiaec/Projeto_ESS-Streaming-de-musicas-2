import { Before, Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

const seedLogin = 'LuisCardoso012';

function apiUrl() {
  return 'http://localhost:3000/api';
}

function normalizePlaylists(body: unknown): any[] {
  if (Array.isArray(body)) return body;
  if (body && typeof body === 'object' && 'value' in body && Array.isArray((body as any).value)) {
    return (body as any).value;
  }
  return [];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fillCreateForm(nome: string, descricao: string, visibilidade: string) {
  // Escopo no formulário de criação para não colidir com o de edição
  cy.get('.pl-form').within(() => {
    cy.get('input[placeholder="Nome da playlist"]').clear();
    if (nome) cy.get('input[placeholder="Nome da playlist"]').type(nome);

    cy.get('input[placeholder="Descrição (opcional)"]').clear();
    if (descricao) cy.get('input[placeholder="Descrição (opcional)"]').type(descricao);

    cy.get('select').select(visibilidade === 'Pública' ? 'publica' : 'privada');
  });
}

function clickSavePlaylist() {
  // Clica no único botão submit visível (Criar Playlist ou Salvar)
  cy.get('form button[type="submit"]').click();
}

function removePlaylistsByName(names: string[]) {
  return cy.request('GET', `${apiUrl()}/playlists`).then(({ body }) => {
    const playlists = normalizePlaylists(body);
    const ids = playlists
      .filter((p: any) => names.includes(p.nome))
      .map((p: any) => p.id);

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

// Cria via API (mais confiável em Given de setup) e recarrega a página
function ensurePlaylistExists(nome: string) {
  return removePlaylistsByName([nome]).then(() => {
    return cy.request('POST', `${apiUrl()}/playlists`, {
      nome,
      descricao: 'Melhores musicas',
      publica: true,
      ownerLogin: seedLogin,
    });
  }).then(() => {
    cy.visit('/playlists');
    cy.contains('h1', 'Playlists').should('be.visible');
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

// ── Hooks ──────────────────────────────────────────────────────────────────

Before(() => {
  return removePlaylistsByName([
    'Músicas de rock 2026',
    'Músicas de rock 2026 Atualizada',
    'Músicas de rock 2026 Duplicada',
    'Playlist privada 2026',
    'Playlist temporária 2026',
    'Playlist de outro usuário',
  ]);
});

// ── Given ──────────────────────────────────────────────────────────────────

Given('a playlist {string} já existe', function (nome: string) {
  return ensurePlaylistExists(nome);
});

Given('existe uma playlist chamada {string}', function (nome: string) {
  return ensurePlaylistExists(nome);
});

Given('existe uma segunda playlist chamada {string}', function (nome: string) {
  return ensurePlaylistExists(nome);
});

Given('existe uma playlist de outro usuário chamada {string}', function (nome: string) {
  return ensurePlaylistExistsForOwner(nome, 'OutroUsuario', true).then(() => {
    cy.visit('/playlists');
    cy.contains('h1', 'Playlists').should('be.visible');
  });
});

// ── When ───────────────────────────────────────────────────────────────────

When('o usuário seleciona a opção {string}', function (opcao: string) {
  if (opcao === 'Criar Playlist') {
    // Clica no card "Nova Playlist" para abrir o formulário de criação
    cy.get('.pl-cover-new').click();
    cy.get('input[placeholder="Nome da playlist"]').should('be.visible');
    return;
  }
  throw new Error(`Opção não suportada: ${opcao}`);
});

When(/^o usuário preenche o nome com "([^"]*)", a descrição com "([^"]*)"\s*,?\s*a visibilidade como "([^"]*)"$/, function (nome: string, descricao: string, visibilidade: string) {
  fillCreateForm(nome, descricao, visibilidade);
  clickSavePlaylist();
});

When('o usuário seleciona os três pontos ao lado do nome {string}', function (nome: string) {
  // Expande o card e clica em Editar (botão real é "Editar", não "Atualizar")
  cy.contains('.pl-card', nome).find('.pl-clickable').click();
  cy.contains('.pl-card', nome).within(() => {
    cy.contains('button', 'Editar').click();
  });
});

When('o usuário muda o nome para {string}', function (novoNome: string) {
  // Usa o primeiro input do formulário de edição (sem placeholder no edit form)
  cy.get('.pl-edit-form').find('input').first().clear().type(novoNome);
  clickSavePlaylist();
});

When('o usuário seleciona o botão {string} da playlist {string}', function (botao: string, nome: string) {
  if (botao !== 'Excluir') throw new Error(`Botão não suportado: ${botao}`);

  cy.on('window:confirm', () => true);

  // Expande o card para mostrar os botões de ação
  cy.contains('.pl-card', nome).find('.pl-clickable').click();
  cy.contains('.pl-card', nome).within(() => {
    cy.contains('button', 'Excluir').click();
  });
});

When('o usuário cancela a exclusão da playlist {string}', function (nome: string) {
  cy.on('window:confirm', () => false);

  cy.contains('.pl-card', nome).find('.pl-clickable').click();
  cy.contains('.pl-card', nome).within(() => {
    cy.contains('button', 'Excluir').click();
  });
});

// ── Then ───────────────────────────────────────────────────────────────────

Then('o usuário consegue ver a playlist com o nome {string}', function (nome: string) {
  // Classe real é .pl-card e o nome está em .pl-nome (div, não h3)
  cy.contains('.pl-card .pl-nome', nome).should('be.visible');
});

Then('eu vejo a playlist {string} como {string}', function (nome: string, visibilidade: string) {
  // Visibilidade é exibida como .badge dentro de .pl-meta
  cy.contains('.pl-card', nome).within(() => {
    cy.contains('.badge', visibilidade).should('be.visible');
  });
});

Then('a playlist {string} não deve aparecer na lista', function (nome: string) {
  // Regex com âncoras para matching EXATO — evita que "Rock 2026" case com "Rock 2026 Atualizada"
  const exactMatch = new RegExp(`^${nome}$`);
  cy.contains('.pl-card .pl-nome', exactMatch).should('not.exist');
});

Then('a playlist {string} deve permanecer na lista', function (nome: string) {
  cy.contains('.pl-card', nome).should('be.visible');
});

Then('a playlist {string} deve existir somente uma vez', function (nome: string) {
  return getPlaylists().then((playlists) => {
    const matches = playlists.filter((p: any) => p.nome === nome);
    expect(matches.length).to.eq(1);
  });
});

Then('a playlist {string} deve ser renomeada para {string}', function (_nomeAntigo: string, nomeNovo: string) {
  return getPlaylists().then((playlists: any) => {
    const nomes = (playlists as any[]).map((p: any) => p.nome);
    expect(nomes).to.include(nomeNovo);
  });
});

Then('eu não vejo os botões {string} e {string} na playlist {string}', function (botao1: string, botao2: string, nome: string) {
  // Expande o card para confirmar que os botões de edição do dono não existem
  cy.contains('.pl-card', nome).find('.pl-clickable').click();
  cy.contains('.pl-card', nome).within(() => {
    cy.contains('button', botao1).should('not.exist');
    cy.contains('button', botao2).should('not.exist');
  });
});

Then('o usuário ainda está na página {string}', function (pagina: string) {
  if (pagina.toLowerCase() !== 'playlists') throw new Error(`Página não suportada: ${pagina}`);
  cy.url().should('include', '/playlists');
});

Then('eu vejo uma mensagem de sucesso{string}', function (mensagem: string) {
  cy.contains('.success', mensagem).should('be.visible');
});

Then('eu vejo uma mensagem de erro{string}', function (mensagem: string) {
  cy.contains('.error', mensagem).should('be.visible');
});
