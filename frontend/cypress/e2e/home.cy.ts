describe('Página Inicial', () => {

  it('exibe mensagem de boas vindas quando nao logado', () => {
    cy.visit('/');
    cy.contains('Bem-vindo ao .WAVe').should('be.visible');
    cy.contains('Entrar').should('be.visible');
    cy.contains('Criar conta').should('be.visible');
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