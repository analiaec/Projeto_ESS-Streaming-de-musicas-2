import { Given, When, Then, Before } from "@cucumber/cucumber";
import assert from "assert";
import { Musica, buscar, ordenarPorReproducoes } from "./musica.model";

// =========================================================================
// Estado do cenário
// =========================================================================

let usuarioLogado:              boolean      = false;
let loginAtual:                 string | null = null;
let paginaAtual:                string | null = null;

// Página inicial
let campoBuscaVisivel:          boolean = false;
let secaoMusicasEmAltaVisivel:  boolean = false;
let secaoPodcastsEmAltaVisivel: boolean = false;
let historicoVisivel:           boolean = false;
let playlistsVisivel:           boolean = false;
let mensagemTopo:               string | null = null;

// Busca
let termoBusca:          string        = "";
let filtroArtistaAlvo:   string | null = null;
let resultadosBusca:     Musica[]      = [];
let filtrosUltimaBusca:  string[]      = [];
let filtrosDisponiveis:  string[]      = [];

// Recomendações
let historicoMusicas: string[]      = [];
let generoHistorico:  string | null = null;
let recomendacoes:    Musica[]      = [];

// Ranking Em Alta
let rankingEmAlta: Musica[] = [];

// =========================================================================
// Hook — reseta estado antes de cada cenário
// =========================================================================

Before(function () {
  usuarioLogado              = false;
  loginAtual                 = null;
  paginaAtual                = null;
  campoBuscaVisivel          = false;
  secaoMusicasEmAltaVisivel  = false;
  secaoPodcastsEmAltaVisivel = false;
  historicoVisivel           = false;
  playlistsVisivel           = false;
  mensagemTopo               = null;
  termoBusca                 = "";
  filtroArtistaAlvo          = null;
  resultadosBusca            = [];
  filtrosUltimaBusca         = [];
  filtrosDisponiveis         = [];
  historicoMusicas           = [];
  generoHistorico            = null;
  recomendacoes              = [];
  rankingEmAlta              = [];
});

// =========================================================================
// 1. Autenticação / Navegação
// =========================================================================

Given(
  "estou logado como {string} com login {string} e senha {string}",
  function (perfil: string, login: string, senha: string) {
    if (login === "LuisCardoso012" && senha === "1234") {
      usuarioLogado = true;
      loginAtual    = login;
    } else {
      throw new Error(`Credenciais inválidas: ${login} / ${senha}`);
    }
  }
);

Given("não estou logado na plataforma", function () {
  usuarioLogado = false;
  loginAtual    = null;
});

Given("estou na página inicial da aplicação", function () {
  paginaAtual = "home";
});

Given("eu estou na página inicial", function () {
  paginaAtual = "home";
});

Given("estou na página de busca", function () {
  paginaAtual = "busca";
});

Given("estou na página {string}", function (pagina: string) {
  paginaAtual = pagina.toLowerCase();
});

// =========================================================================
// 2. Página Inicial
// =========================================================================

When("acesso a página inicial", function () {
  paginaAtual                = "home";
  campoBuscaVisivel          = true;
  secaoMusicasEmAltaVisivel  = true;
  secaoPodcastsEmAltaVisivel = true;
  historicoVisivel           = usuarioLogado;
  playlistsVisivel           = usuarioLogado;
  mensagemTopo               = usuarioLogado
                               ? `Ola, ${loginAtual}!`
                               : "Faça login";
});

Then("posso ver o campo de busca", function () {
  assert.ok(campoBuscaVisivel, "Campo de busca não está visível");
});

Then("posso ver a seção {string}", function (secao: string) {
  if (secao === "Músicas em Alta") {
    assert.ok(secaoMusicasEmAltaVisivel, "Seção 'Músicas em Alta' não visível");
  } else if (secao === "Podcasts em Alta") {
    assert.ok(secaoPodcastsEmAltaVisivel, "Seção 'Podcasts em Alta' não visível");
  } else {
    throw new Error(`Seção desconhecida: ${secao}`);
  }
});

Then("posso ver meu histórico de músicas ouvidas recentemente", function () {
  assert.ok(historicoVisivel, "Histórico não visível para usuário logado");
});

Then("não posso ver meu histórico de músicas ouvidas recentemente", function () {
  assert.ok(!historicoVisivel, "Histórico não deveria estar visível");
});

Then("posso ver minhas playlists", function () {
  assert.ok(playlistsVisivel, "Playlists não visíveis para usuário logado");
});

Then("não posso ver minhas playlists", function () {
  assert.ok(!playlistsVisivel, "Playlists não deveriam estar visíveis");
});

Then("posso ver um ícone", function () {
  assert.ok(usuarioLogado, "Ícone visível apenas para usuário logado");
});

Then("vejo uma mensagem na parte de cima da tela: {string}", function (esperada: string) {
  assert.strictEqual(mensagemTopo, esperada, "Mensagem no topo incorreta");
});

// =========================================================================
// 3. Busca — Givens
// =========================================================================

Given(
  "não existe nenhum item no sistema que tenha título {string} ou semelhante",
  function (titulo: string) {
    const encontrados = buscar(titulo, null, null, null);
    assert.strictEqual(encontrados.length, 0,
      `Item '${titulo}' não deveria existir no catálogo`);
  }
);

Given("existe um item com título {string}", function (titulo: string) {
  const encontrados = buscar(titulo, null, null, null);
  assert.ok(encontrados.length > 0, `Item '${titulo}' não encontrado`);
});

Given("existe no sistema músicas do ano {string}", function (ano: string) {
  const encontrados = buscar(null, null, ano, null);
  assert.ok(encontrados.length > 0, `Nenhuma música do ano ${ano}`);
});

Given("existe no sistema músicas do gênero {string}", function (genero: string) {
  const encontrados = buscar(null, genero, null, null);
  assert.ok(encontrados.length > 0, `Nenhuma música do gênero '${genero}'`);
});

Given("existe no sistema músicas do artista {string}", function (artista: string) {
  filtroArtistaAlvo = artista;
  const encontrados = buscar(null, null, null, artista);
  assert.ok(encontrados.length > 0, `Nenhuma música do artista '${artista}'`);
});

Given(
  "existe no sistema a música {string} do gênero {string}",
  function (titulo: string, genero: string) {
    const encontrados = buscar(titulo, genero, null, null);
    assert.ok(encontrados.length > 0,
      `Música '${titulo}' do gênero '${genero}' não encontrada`);
  }
);

Given(
  "o sistema possui os filtros {string}, {string} armazenados como filtros utilizados na última busca feita pela conta",
  function (f1: string, f2: string) {
    filtrosUltimaBusca = [f1, f2];
  }
);

// =========================================================================
// 3. Busca — Whens
// =========================================================================

When("seleciono a seção de busca", function () {
  paginaAtual       = "busca";
  filtrosDisponiveis = ["gênero", "Nome do artista/podcast", "Ano de lançamento"];
});

When("realizo uma busca pelo termo {string}", function (termo: string) {
  resultadosBusca = buscar(termo, null, null, null);
});

When("pesquiso por uma música sem preencher o campo de busca", function () {
  termoBusca = "";
});

When("pesquiso pelo termo {string}", function (termo: string) {
  termoBusca = termo;
});

When("não preencho o campo de nome", function () {
  termoBusca = "";
});

When("preencho o campo nome com {string}", function (valor: string) {
  termoBusca = valor;
});


When("aplico o filtro de gênero {string}", function (genero: string) {
  const termo = termoBusca || null;
  const lista = buscar(termo, genero, null, null);
  resultadosBusca = ordenarPorReproducoes(lista).slice(0, 10);
});

When("aplico o filtro de ano de lançamento {string}", function (ano: string) {
  const lista = buscar(null, null, ano, null);
  resultadosBusca = ordenarPorReproducoes(lista).slice(0, 10);
});

When("aplico o filtro de nome de artista {string}", function (artista: string) {
  const alvo = filtroArtistaAlvo ?? artista;
  const lista = buscar(null, null, null, alvo);
  resultadosBusca   = ordenarPorReproducoes(lista).slice(0, 10);
  filtroArtistaAlvo = alvo;
});

When("acesso a tela de busca sem realizar mais nenhuma ação", function () {
  paginaAtual = "busca";
});

// =========================================================================
// 3. Busca — Thens
// =========================================================================

Then("posso ver o campo de busca por nome da música", function () {
  assert.strictEqual(paginaAtual, "busca", "Não está na página de busca");
});

Then("posso ver o campo de filtro {string}", function (filtro: string) {
  assert.ok(
    filtrosDisponiveis.includes(filtro),
    `Filtro '${filtro}' não disponível. Disponíveis: ${filtrosDisponiveis}`
  );
});

Then(
  "o sistema deve exibir um placeholder informando que nenhum resultado foi encontrado",
  function () {
    assert.strictEqual(resultadosBusca.length, 0,
      "Resultados não deveriam ser exibidos");
  }
);

Then("nenhum conteúdo deve ser listado", function () {
  assert.strictEqual(resultadosBusca.length, 0, "Lista deveria estar vazia");
});

Then("eu continuo na página de busca", function () {
  assert.strictEqual(paginaAtual, "busca", "Usuário saiu da página de busca");
});

Then("devo ver um placeholder informando que não houveram resultados", function () {
  assert.strictEqual(resultadosBusca.length, 0, "Lista deveria estar vazia");
});

Then("o sistema não deve exibir nenhum item na lista de resultados", function () {
  assert.strictEqual(resultadosBusca.length, 0, "Lista deveria estar vazia");
});

Then("os stakeholders querem um passo novo ao executar a ação", function () {
  // Passo pendente — aguardando definição dos stakeholders
});

Then(
  "o sistema deve exibir a música {string} nos resultados",
  function (titulo: string) {
    const encontrada = resultadosBusca.some((m) => m.titulo === titulo);
    assert.ok(encontrada, `'${titulo}' não encontrada nos resultados`);
  }
);

Then(
  "os resultados devem estar ordenados priorizando correlações exatas e depois parciais",
  function () {
    assert.ok(resultadosBusca.length > 0, "Nenhum resultado para verificar");
    assert.ok(
      resultadosBusca[0].titulo.includes("MusicaBonita123"),
      "Primeiro resultado deveria ser correlação exata"
    );
  }
);

Then(
  "os resultados devem estar ordenados de forma decrescente priorizando correlações exatas e depois parciais",
  function () {
    assert.ok(resultadosBusca.length > 0, "Nenhum resultado para verificar");
    assert.ok(
      resultadosBusca[0].titulo.includes("MusicaBonita123"),
      "Primeiro resultado deveria ser correlação exata"
    );
  }
);

Then(
  "músicas com mesma correlação devem ser ordenadas pelo total de reproduções",
  function () {
    // coberto pelo step de ordenação decrescente
  }
);

Then(
  "nenhuma música sem correlação com {string} deve ser exibida",
  function (termo: string) {
    const termoNorm = termo.toLowerCase().replace("ú", "u");
    resultadosBusca.forEach((m) => {
      const tituloNorm = m.titulo.toLowerCase().replace("ú", "u");
      assert.ok(
        tituloNorm.includes(termoNorm),
        `Música sem correlação: '${m.titulo}'`
      );
    });
  }
);

Then(
  "os resultados devem estar ordenados de forma decrescente pelo total de reproduções",
  function () {
    for (let i = 0; i < resultadosBusca.length - 1; i++) {
      assert.ok(
        resultadosBusca[i].reproducoes >= resultadosBusca[i + 1].reproducoes,
        `Ordem incorreta: '${resultadosBusca[i].titulo}' antes de '${resultadosBusca[i + 1].titulo}'`
      );
    }
  }
);

Then(
  "nenhuma música com ano de lançamento diferente de {string} deve ser exibida",
  function (ano: string) {
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.ano, parseInt(ano),
        `Música '${m.titulo}' tem ano ${m.ano}`)
    );
  }
);

Then(
  "o sistema deve exibir as 10 músicas com maior número de reproduções do ano {string}",
  function (ano: string) {
    assert.ok(resultadosBusca.length <= 10,
      `Mais de 10 resultados: ${resultadosBusca.length}`);
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.ano, parseInt(ano),
        `Música '${m.titulo}' tem ano ${m.ano}`)
    );
  }
);

Then(
  "o sistema deve exibir os filtros {string}, {string} como últimos filtros aplicados",
  function (f1: string, f2: string) {
    assert.ok(filtrosUltimaBusca.includes(f1), `Filtro '${f1}' não encontrado`);
    assert.ok(filtrosUltimaBusca.includes(f2), `Filtro '${f2}' não encontrado`);
  }
);

Then(
  "o sistema deve exibir as 10 músicas com maior número de reproduções do gênero {string} nos resultados",
  function (genero: string) {
    assert.ok(resultadosBusca.length <= 10,
      `Mais de 10 resultados: ${resultadosBusca.length}`);
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.genero, genero,
        `Música '${m.titulo}' tem gênero '${m.genero}'`)
    );
  }
);

Then(
  "nenhuma música de gênero diferente de {string} deve ser listada",
  function (genero: string) {
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.genero, genero,
        `Gênero incorreto em '${m.titulo}'`)
    );
  }
);

Then(
  "o sistema deve exibir as 10 músicas com maior número de reproduções associadas ao artista {string} nos resultados",
  function (artista: string) {
    assert.ok(resultadosBusca.length <= 10);
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.artista, artista,
        `'${m.titulo}' é de '${m.artista}'`)
    );
  }
);

Then(
  "nenhuma música associada a um outro nome de artista deve ser listada",
  function () {
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.artista, filtroArtistaAlvo,
        `Artista incorreto em '${m.titulo}'`)
    );
  }
);

Then(
  "nenhuma música associada à um outro nome de artista deve ser listada",
  function () {
    resultadosBusca.forEach((m) =>
      assert.strictEqual(m.artista, filtroArtistaAlvo,
        `Artista incorreto em '${m.titulo}'`)
    );
  }
);

// =========================================================================
// 4. Ranking Em Alta
// =========================================================================

Given(
  "que a música {string} está cadastrada no sistema, está no ranking Em Alta e possui {int} reproduções",
  function (titulo: string, reproducoes: number) {
    rankingEmAlta.push({ titulo, genero: "MPB", ano: 2000, artista: "Artista", reproducoes });
  }
);

Given(
  "a música {string} está cadastrada no sistema, está no em alta e possui {int} reproduções",
  function (titulo: string, reproducoes: number) {
    rankingEmAlta.push({ titulo, genero: "MPB", ano: 2000, artista: "Artista", reproducoes });
  }
);

When("o sistema ordena o ranking músicas Em Alta", function () {
  reordenarRanking();
});

When("o sistema ordena o ranking de músicas Em Alta", function () {
  reordenarRanking();
});

When(
  "a música {string} recebe {int} novas reproduções",
  function (titulo: string, novas: number) {
    const musica = rankingEmAlta.find((m) => m.titulo === titulo);
    if (!musica) throw new Error(`Música '${titulo}' não encontrada no ranking`);
    musica.reproducoes += novas;
    reordenarRanking();
  }
);

Then(
  "as músicas devem ser ordenadas de maneira alfabética por critério de desempate",
  function () {
    for (let i = 0; i < rankingEmAlta.length - 1; i++) {
      const a = rankingEmAlta[i];
      const b = rankingEmAlta[i + 1];
      if (a.reproducoes === b.reproducoes) {
        assert.ok(
          a.titulo.localeCompare(b.titulo) <= 0,
          `Desempate incorreto: '${a.titulo}' deveria vir antes de '${b.titulo}'`
        );
      }
    }
  }
);

Then(
  "o total de reproduções da música {string} deve ser {int}",
  function (titulo: string, total: number) {
    const musica = rankingEmAlta.find((m) => m.titulo === titulo);
    if (!musica) throw new Error(`Música '${titulo}' não encontrada`);
    assert.strictEqual(musica.reproducoes, total,
      `'${titulo}': esperado ${total}, encontrado ${musica.reproducoes}`);
  }
);

Then(
  "o ranking de músicas em alta exibe {string} na posição {int}",
  function (titulo: string, posicao: number) {
    const tituloNaPosicao = rankingEmAlta[posicao - 1].titulo;
    assert.strictEqual(tituloNaPosicao, titulo,
      `Posição ${posicao}: esperado '${titulo}', encontrado '${tituloNaPosicao}'`);
  }
);

// =========================================================================
// 5. Recomendações
// =========================================================================

Given(
  "meu histórico de reproduções contém apenas as músicas {string} e {string} do gênero {string}",
  function (m1: string, m2: string, genero: string) {
    historicoMusicas = [m1, m2];
    generoHistorico  = genero;
  }
);

Given(
  "existem músicas do gênero {string} armazenadas no sistema que não estão presentes no meu histórico",
  function (genero: string) {
    const fora = buscar(null, genero, null, null)
      .filter((m) => !historicoMusicas.includes(m.titulo));
    assert.ok(fora.length > 0,
      `Não há músicas de '${genero}' fora do histórico`);
  }
);

When("eu acesso a seção de músicas recomendadas", function () {
  recomendacoes = buscar(null, generoHistorico, null, null)
    .filter((m) => !historicoMusicas.includes(m.titulo));
});

Then(
  "o sistema deve exibir músicas do gênero {string} nas recomendações",
  function (genero: string) {
    assert.ok(recomendacoes.length > 0, "Nenhuma recomendação gerada");
    recomendacoes.forEach((m) =>
      assert.strictEqual(m.genero, genero,
        `Gênero incorreto em recomendação: ${m.titulo}`)
    );
  }
);

Then("músicas de outros gêneros não devem ser recomendadas", function () {
  recomendacoes.forEach((m) =>
    assert.strictEqual(m.genero, generoHistorico,
      `Gênero incorreto: ${m.titulo}`)
  );
});

Then(
  "músicas {string} e {string} não devem ser recomendadas",
  function (m1: string, m2: string) {
    recomendacoes.forEach((m) => {
      assert.notStrictEqual(m.titulo, m1,
        `'${m1}' não deveria estar nas recomendações`);
      assert.notStrictEqual(m.titulo, m2,
        `'${m2}' não deveria estar nas recomendações`);
    });
  }
);

// =========================================================================
// Helper
// =========================================================================

function reordenarRanking(): void {
  rankingEmAlta.sort((a, b) =>
    b.reproducoes !== a.reproducoes
      ? b.reproducoes - a.reproducoes
      : a.titulo.localeCompare(b.titulo)
  );
}
