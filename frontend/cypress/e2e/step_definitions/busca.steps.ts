import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// ─── Given ───────────────────────────────────────────────────────────────────

Given('estou na página de busca', () => {
  cy.visit('/busca');
});

Given('existe no sistema a música {string} do gênero {string}',
  (titulo: string, genero: string) => {
    cy.request(
      `http://localhost:3000/api/users/LuisCardoso012/musicas?termo=${encodeURIComponent(titulo)}&genero=${encodeURIComponent(genero)}`
    ).then((response) => {
      expect(response.body.length).to.be.greaterThan(0,
        `Música '${titulo}' do gênero '${genero}' não encontrada — rode o seed antes dos testes`
      );
    });
  }
);

Given('existe no sistema a música {string} do artista {string}',
  (titulo: string, artista: string) => {
    cy.request(
      `http://localhost:3000/api/users/LuisCardoso012/musicas?termo=${encodeURIComponent(titulo)}&artista=${encodeURIComponent(artista)}`
    ).then((response) => {
      expect(response.body.length).to.be.greaterThan(0,
        `Música '${titulo}' do artista '${artista}' não encontrada — rode o seed antes dos testes`
      );
    });
  }
);

Given('não existe no sistema nenhuma música com nome {string}',
  (titulo: string) => {
    cy.request(
      `http://localhost:3000/api/users/LuisCardoso012/musicas?termo=${encodeURIComponent(titulo)}`
    ).then((response) => {
      expect(response.body.length).to.equal(0,
        `Música '${titulo}' foi encontrada no sistema — remova-a antes dos testes`
      );
    });
  }
);

// ─── When ────────────────────────────────────────────────────────────────────

When('seleciono o gênero {string}', (genero: string) => {
  cy.get('select').select(genero);
});

When('digito {string} no campo de busca', (termo: string) => {
  cy.get('input.busca-main-input').type(termo);
});

When('digito {string} no campo de artista', (artista: string) => {
  cy.get('input[placeholder="Filtrar por artista…"]').type(artista);
});

When('clico em buscar', () => {
  cy.get('button.busca-submit').click();
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('devo ver a música {string} de gênero {string} nos resultados',
  (titulo: string, genero: string) => {
    // verifica que o título aparece na tela
    cy.contains(titulo).should('be.visible');

    // verifica via API que a música pertence ao gênero correto
    cy.request(
      `http://localhost:3000/api/users/LuisCardoso012/musicas?termo=${encodeURIComponent(titulo)}&genero=${encodeURIComponent(genero)}`
    ).then((response) => {
      expect(response.body.length).to.be.greaterThan(0,
        `Música '${titulo}' do gênero '${genero}' não encontrada nos resultados`
      );
      expect(response.body[0].album.generos).to.include(genero);
    });
  }
);

