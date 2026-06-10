import { Before, Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

const BASE_URL = 'http://localhost:3000/api';
const LOGIN_PADRAO = 'LuisCardoso012';

Before(() => {
  cy.exec('cd ../backend && npm run seed', { failOnNonZero: false, timeout: 30000 });
});

// ─── Given ───────────────────────────────────────────────────────────────────



Given('meu histórico de reproduções contém apenas músicas dos gêneros {string} e {string}',
  (genero1: string, genero2: string) => {
    // verifica que existem músicas desses gêneros no banco
    cy.request(
      `${BASE_URL}/users/${LOGIN_PADRAO}/musicas?genero=${encodeURIComponent(genero1)}`
    ).then((response) => {
      expect(response.body.length).to.be.greaterThan(0,
        `Nenhuma música do gênero '${genero1}' — rode o seed antes dos testes`
      );
    });

    cy.request(
      `${BASE_URL}/users/${LOGIN_PADRAO}/musicas?genero=${encodeURIComponent(genero2)}`
    ).then((response) => {
      expect(response.body.length).to.be.greaterThan(0,
        `Nenhuma música do gênero '${genero2}' — rode o seed antes dos testes`
      );
    });
  }
);

Given('existem músicas do gênero {string} armazenadas no sistema que não estão presentes no meu histórico',
  (genero: string) => {
    cy.request(
      `${BASE_URL}/users/${LOGIN_PADRAO}/musicas?genero=${encodeURIComponent(genero)}`
    ).then((response) => {
      expect(response.body.length).to.be.greaterThan(0,
        `Não há músicas do gênero '${genero}' fora do histórico no sistema`
      );
    });
  }
);

Given('meu histórico de reproduções contém 10 ou mais reproduções do gênero {string}',
  (genero: string) => {
    cy.request(`${BASE_URL}/users/${LOGIN_PADRAO}/musicas?genero=${encodeURIComponent(genero)}`)
      .then((response) => {
        const musicas = response.body;
        expect(musicas.length).to.be.greaterThan(0,
          `Nenhuma música do gênero '${genero}' — rode o seed antes dos testes`
        );

        // pega apenas a primeira música e reproduz 10 vezes em sequência
        const musica = musicas[0];

        const fazerReproducao = (count: number) => {
          if (count >= 10) return;
          cy.request({
            method: 'POST',
            url: `${BASE_URL}/users/${LOGIN_PADRAO}/musicas/${musica.id}/reproducao`,
            body: {},
            failOnStatusCode: false,
          }).then(() => {
            fazerReproducao(count + 1);
          });
        };

        fazerReproducao(0);
      });

    cy.wait(3000);

    cy.request({
      method: 'GET',
      url: `${BASE_URL}/users/${LOGIN_PADRAO}/playback/music`,
      failOnStatusCode: false,
    }).then((response) => {
      const historico = response.status === 404 ? [] : response.body;
      expect(historico.length).to.be.gte(10,
        'O histórico tem menos de 10 reproduções após tentar popular'
      );
    });
  }
);

Given('meu histórico de reproduções contém menos de 10 reproduções', () => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/users/${LOGIN_PADRAO}/playback/music`,
    failOnStatusCode: false,
  }).then((response) => {
    const historico = response.status === 404 ? [] : response.body;
    expect(historico.length).to.be.lessThan(10,
      'O histórico tem 10 ou mais reproduções — rode o seed antes dos testes para limpar o histórico'
    );
  });
});

// ─── When ────────────────────────────────────────────────────────────────────

When('eu acesso a seção de músicas recomendadas', () => {
  cy.visit('/recomendacoes');
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then('o sistema deve exibir músicas do gênero {string} nas recomendações',
  (genero: string) => {
    // verifica via API que há recomendações do gênero
    cy.request(
      `${BASE_URL}/users/${LOGIN_PADRAO}/musicas/recomendadas`
    ).then((response) => {
      const recomendacoes = response.body;
      expect(recomendacoes.length).to.be.greaterThan(0,
        'Nenhuma recomendação disponível'
      );
      const temGenero = recomendacoes.some(
        (score: any) => score.musica.album.generos.includes(genero)
      );
      expect(temGenero).to.be.true;
    });

    // verifica que as músicas aparecem na tela
    cy.get('.musica-item').should('have.length.greaterThan', 0);
  }
);

Then('músicas de outros gêneros não devem ser recomendadas', () => {
  cy.request(
    `${BASE_URL}/users/${LOGIN_PADRAO}/musicas/recomendadas`
  ).then((response) => {
    const recomendacoes = response.body;
    const generosPermitidos = ['MPB', 'Bossa Nova'];

    recomendacoes.forEach((score: any) => {
      const generosMusica: string[] = score.musica.album.generos;
      const temGeneroPermitido = generosMusica.some(
        g => generosPermitidos.includes(g)
      );
      expect(temGeneroPermitido).to.be.true;
    });
  });
});

Then('nenhuma música presente no meu histórico deve ser recomendada', () => {
  cy.request({
    method: 'GET',
    url: `${BASE_URL}/users/${LOGIN_PADRAO}/playback/music`,
    failOnStatusCode: false,
  }).then((historicoResponse) => {
    const historico = historicoResponse.status === 404 ? [] : historicoResponse.body;
    const idsHistorico = historico
      .filter((p: any) => p.musica)
      .map((p: any) => p.musica.id);

    cy.request(
      `${BASE_URL}/users/${LOGIN_PADRAO}/musicas/recomendadas`
    ).then((recResponse) => {
      recResponse.body.forEach((score: any) => {
        expect(idsHistorico).not.to.include(score.musica.id,
          `Música '${score.musica.titulo}' está no histórico e não deveria ser recomendada`
        );
      });
    });
  });
});

Then('nenhuma música deve ser recomendada', () => {
  cy.request(
    `${BASE_URL}/users/${LOGIN_PADRAO}/musicas/recomendadas`
  ).then((response) => {
    expect(response.body.length).to.equal(0);
  });

  cy.get('.musica-item').should('not.exist');
});


Then('o card {string} não deve ser exibido na página inicial', (card: string) => {
  cy.contains(card).should('not.exist');
});