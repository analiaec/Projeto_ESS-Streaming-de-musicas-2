describe('Página Inicial', () => {

  it('exibe mensagem de faca login quando nao logado', () => {
    cy.visit('/');
    cy.contains('Faça login').should('be.visible');
    cy.contains('Login').should('be.visible');
  });

  it('exibe botoes de navegacao', () => {
    cy.visit('/');
    cy.contains('Músicas em Alta').should('be.visible');
    cy.contains('Buscar Músicas').should('be.visible');
  });

});