import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { loginViaApi } from './common.steps';

const API = 'http://localhost:3000/api';

let repCountBefore = 0;
let lastPlayedTitle = '';

function ensureEpisodeExists(titulo: string, podcastLogin: string) {
  cy.request({
    method: 'POST',
    url: `${API}/auth/login`,
    body: { login: podcastLogin, password: '1234' },
  }).then(({ body: { access_token } }) => {
    cy.request({
      method: 'POST',
      url: `${API}/podcast/${podcastLogin}/episodes`,
      headers: { Authorization: `Bearer ${access_token}` },
      body: { titulo, arquivoUrl: 'https://exemplo.com/ep-test.mp3' },
      failOnStatusCode: false,
    });
  });
  cy.reload();
}

// ── Given ──────────────────────────────────────────────────────────────────

Given('o usuário está na página pública do podcast {string}', (podLogin: string) => {
  cy.visit(`/podcast/${podLogin}`);
});

Given('existe um episódio chamado {string} no podcast {string}', (titulo: string, podLogin: string) => {
  ensureEpisodeExists(titulo, podLogin);
});

// ── When ───────────────────────────────────────────────────────────────────

When('o usuário preenche o título com {string} e o arquivo com {string}', (titulo: string, arquivo: string) => {
  cy.get('input[placeholder="Título do episódio"]').clear().type(titulo);
  cy.get('input[placeholder="https://… (mp3, wav, m4a)"]').clear().type(arquivo);
});

When('o usuário preenche o título com {string} e o arquivo com {string} e agenda para {string}', (titulo: string, arquivo: string, data: string) => {
  cy.get('input[placeholder="Título do episódio"]').clear().type(titulo);
  cy.get('input[placeholder="https://… (mp3, wav, m4a)"]').clear().type(arquivo);
  cy.get('input[type="datetime-local"]').type(data);
});

When('o usuário clica em {string}', (botao: string) => {
  cy.contains('button', botao).click();
});

When('o usuário edita o episódio {string} com o novo título {string}', (tituloAtual: string, novoTitulo: string) => {
  cy.contains('.mp-ep-titulo', tituloAtual)
    .closest('.mp-ep')
    .contains('button', 'Editar')
    .click();
  cy.get('.mp-edit-form input').first().clear().type(novoTitulo);
  cy.get('.mp-edit-actions').contains('button', 'Salvar').click();
});

When('o usuário deleta o episódio {string}', (titulo: string) => {
  cy.on('window:confirm', () => true);
  cy.contains('.mp-ep-titulo', titulo)
    .closest('.mp-ep')
    .contains('button', 'Deletar')
    .click();
});

When('o usuário clica em reproduzir o episódio {string}', (titulo: string) => {
  lastPlayedTitle = titulo;
  cy.contains('.ep-titulo', titulo)
    .closest('.ep-item')
    .find('.ep-rep')
    .invoke('text')
    .then(text => {
      repCountBefore = parseInt(text.match(/\d+/)?.[0] ?? '0', 10);
    });
  cy.contains('.ep-titulo', titulo)
    .closest('.ep-item')
    .find('.ep-play-btn')
    .click();
});

// ── Then ───────────────────────────────────────────────────────────────────

Then('o episódio {string} deve aparecer na lista', (titulo: string) => {
  cy.contains('.mp-ep-titulo, .ep-titulo', titulo).should('be.visible');
});

Then('o episódio {string} deve estar marcado como {string}', (titulo: string, status: string) => {
  const badgeClass = status === 'Publicado' ? '.mp-badge-live' : '.mp-badge-sched';
  cy.contains('.mp-ep-titulo', titulo)
    .closest('.mp-ep')
    .find(badgeClass)
    .should('be.visible');
});

Then('o episódio {string} não deve aparecer na lista pública', (titulo: string) => {
  cy.get('.ep-list').should('be.visible');
  cy.contains('.ep-titulo', new RegExp(`^${titulo}$`)).should('not.exist');
});

Then('o episódio {string} não deve aparecer na lista', (titulo: string) => {
  cy.contains('.mp-ep-titulo', new RegExp(`^${titulo}$`)).should('not.exist');
});

Then('o contador de reproduções do episódio aumenta em 1', () => {
  cy.contains('.ep-titulo', lastPlayedTitle)
    .closest('.ep-item')
    .find('.ep-rep')
    .should('contain', `${repCountBefore + 1} rep.`);
});

Then('o total de reproduções do canal deve ser exibido', () => {
  cy.get('.perfil-stat-num').first().invoke('text').then(text => {
    expect(parseInt(text, 10)).to.be.a('number').and.to.be.at.least(0);
  });
});

Then('o total de acessos exibido deve ser 0', () => {
  cy.get('.perfil-stat-num').first().should('have.text', '0');
});

Then('o botão de download está disponível para o episódio {string}', (titulo: string) => {
  cy.contains('.ep-titulo', titulo)
    .closest('.ep-item')
    .contains('button', 'Download')
    .should('be.visible');
});

Then('o episódio {string} exibe o link {string}', (titulo: string, linkText: string) => {
  cy.contains('.ep-titulo', titulo)
    .closest('.ep-item')
    .contains(linkText)
    .should('be.visible');
});
