describe('Integração — Busca', () => {

  // ─── Busca por nome ──────────────────────────────────────────────────────────

  describe('Busca por nome que retorna resultado', () => {

    it('exibe a musica buscada nos resultados', () => {
      cy.visit('/busca');
      cy.get('input.busca-main-input').type('Catherine');
      cy.get('button.busca-submit').click();
      cy.contains('Catherine').should('be.visible');
    });

    it('nao exibe musicas sem correlacao com o termo buscado', () => {
      cy.visit('/busca');
      cy.get('input.busca-main-input').type('Catherine');
      cy.get('button.busca-submit').click();
      cy.get('.musica-item').each(($item) => {
        cy.wrap($item).contains(/catherine/i);
      });
    });

  });

  // ─── Busca por gênero ────────────────────────────────────────────────────────

  describe('Busca por filtro de genero', () => {

    it('exibe resultados ao selecionar genero MPB', () => {
      cy.visit('/busca');
      cy.get('select').select('MPB');
      cy.get('button.busca-submit').click();
      cy.get('.musica-item').should('have.length.greaterThan', 0);
    });

    it('nao exibe mais de 10 musicas', () => {
      cy.visit('/busca');
      cy.get('select').select('MPB');
      cy.get('button.busca-submit').click();
      cy.get('.musica-item').should('have.length.lessThan', 11);
    });

  });

  // ─── Busca por artista ───────────────────────────────────────────────────────

  describe('Busca por filtro de artista', () => {

    it('exibe resultados ao filtrar por artista Noel Rosa', () => {
      cy.visit('/busca');
      cy.get('input[placeholder="Filtrar por artista…"]').type('Noel Rosa');
      cy.get('button.busca-submit').click();
      cy.get('.musica-item').should('have.length.greaterThan', 0);
    });

  });

  // ─── Busca combinada nome + gênero ──────────────────────────────────────────

  describe('Busca combinada por nome e genero', () => {

    it('exibe musica Se.. ao buscar com filtro MPB', () => {
      cy.visit('/busca');
      cy.get('input.busca-main-input').type('Se..');
      cy.get('select').select('MPB');
      cy.get('button.busca-submit').click();
      cy.contains('Se..').should('be.visible');
    });

  });

  // ─── Busca sem resultados ────────────────────────────────────────────────────

  describe('Busca sem resultados', () => {

    it('exibe mensagem quando nenhum resultado encontrado', () => {
      cy.visit('/busca');
      cy.get('input.busca-main-input').type('MusicaPesada123');
      cy.get('button.busca-submit').click();
      cy.contains('Nenhum resultado para essa busca').should('be.visible');
    });

    it('nao exibe itens na lista quando sem resultados', () => {
      cy.visit('/busca');
      cy.get('input.busca-main-input').type('MusicaPesada123');
      cy.get('button.busca-submit').click();
      cy.get('.musica-item').should('not.exist');
    });

  });

});