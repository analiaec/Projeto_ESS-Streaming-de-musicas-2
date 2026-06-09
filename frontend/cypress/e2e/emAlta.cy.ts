// cypress/e2e/integracao/em-alta.cy.ts

describe('Integração — Em Alta', () => {

  it('busca músicas em alta da API e exibe na tela', () => {
    // intercepta a chamada à API e verifica que foi feita
    cy.intercept('GET', '**/musicas/em-alta').as('emAlta');

    cy.visit('/em-alta');

    // espera a chamada à API ser concluída
    cy.wait('@emAlta').then((interception) => {
      // verifica que a API retornou músicas
      expect(interception.response.statusCode).to.eq(200);
      expect(interception.response.body).to.have.length.greaterThan(0);
    });

    // verifica que os dados aparecem na tela
    cy.get('.musica-item').should('have.length.greaterThan', 0);
    cy.get('.musica-posicao').first().should('contain', '#1');
  });

});