describe('Página Inicial', () => {

  it('exibe mensagem de boas vindas quando nao logado', () => {
    cy.visit('/');
    cy.contains('Bem-vindo ao .WAVe').should('be.visible');
    cy.contains('Entrar').should('be.visible');
    cy.contains('Criar conta').should('be.visible');
  });
  
  it('exibe todos os campos quando usuario esta logado', () => {
  cy.visit('/login');
  cy.get('input[placeholder="seu_login"]').type('LuisCardoso012');
  cy.get('input[type="password"]').type('1234');
  cy.get('button.auth-submit').click();

  cy.url().should('include', '/');

  cy.contains('Olá, LuisCardoso012').should('be.visible');


  cy.contains('Explorar').should('be.visible');
  cy.contains('Em Alta').should('be.visible');
  cy.contains('Buscar').should('be.visible');
  cy.contains('Podcasts').should('be.visible');

  cy.contains('Sua biblioteca').should('be.visible');
  cy.contains('Para Você').should('be.visible');
  cy.contains('Playlists').should('be.visible');
  cy.contains('Histórico').should('be.visible');
  cy.contains('Minha Conta').should('be.visible');

  cy.contains('Criar conta').should('not.exist');
  cy.contains('Entrar').should('not.exist');
});

  it('exibe cards de navegacao publica', () => {
    cy.visit('/');
    cy.contains('Em Alta').should('be.visible');
    cy.contains('Buscar').should('be.visible');
    cy.contains('Podcasts').should('be.visible');
  });

  it('nao exibe biblioteca pessoal quando nao logado', () => {
    cy.visit('/');
    cy.contains('Sua biblioteca').should('not.exist');
  });

});