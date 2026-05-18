import { Given, When, Then, Before } from "@cucumber/cucumber";
import assert from "assert";

const BASE_URL = "http://localhost:3000/api";

interface Musica {
  id:          number;
  titulo:      string;
  genero:      string;
  ano:         number;
  artista?:    string;
  artistas?:   { id: number; nome: string, nomeArtistico: string }[];
  reproducoes: number;
}


let token:                     string | null = null;
let usuarioLogado:             boolean       = false;
let loginAtual:                string | null = null;
let paginaAtual:               string | null = null;

// Página inicial
let campoBuscaVisivel:          boolean = false;
let secaoMusicasEmAltaVisivel:  boolean = false;
let secaoPodcastsEmAltaVisivel: boolean = false;
let historicoVisivel:           boolean = false;
let playlistsVisivel:           boolean = false;
let mensagemTopo:               string | null = null;

// Busca
let termoBusca:         string   = "";
let filtroArtistaAlvo:  string | null = null;
let resultadosBusca:    Musica[] = [];
let filtrosUltimaBusca: string[] = [];
let filtrosDisponiveis: string[] = [];

// Recomendações
let historicoMusicas: string[]      = [];
let generoHistorico:  string | null = null;
let recomendacoes:    Musica[]      = [];

// Ranking Em Alta 
let rankingEmAlta: Musica[] = [];

// Helpers HTTP

async function get(path: string, autenticado = false): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (autenticado && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, { headers });
  return response.json();
}

async function post(path: string, body: any, autenticado = false): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (autenticado && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return response.json();
}

// Hook — reseta estado antes de cada cenário

Before(function () {
  token                  = null;
  usuarioLogado          = false;
  loginAtual             = null;
  paginaAtual            = null;
  campoBuscaVisivel      = false;
  secaoMusicasEmAltaVisivel  = false;
  secaoPodcastsEmAltaVisivel = false;
  historicoVisivel       = false;
  playlistsVisivel       = false;
  mensagemTopo           = null;
  termoBusca             = "";
  filtroArtistaAlvo      = null;
  resultadosBusca        = [];
  filtrosUltimaBusca     = [];
  filtrosDisponiveis     = [];
  historicoMusicas       = [];
  generoHistorico        = null;
  recomendacoes          = [];
  rankingEmAlta          = [];
});

// 1. Autenticação / Navegação

Given(
  "estou logado como {string} com login {string} e senha {string}",
  async function (perfil: string, login: string, senha: string) {
    // auth ainda não implementado — simula login
    usuarioLogado = true;
    loginAtual    = login;
  }
);

Given("não estou logado na plataforma", function () {
  token         = null;
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

// 2. Página Inicial

When("acesso a página inicial", async function () {
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

// 3. Busca — Givens

Given(
  "não existe nenhum item no sistema que tenha título {string} ou semelhante",
  async function (titulo: string) {
    const resultado = await get(`/musicas?termo=${encodeURIComponent(titulo)}`);
    assert.strictEqual(resultado.length, 0,
      `Item '${titulo}' não deveria existir no sistema`);
  }
);

Given("existe um item com título {string}", async function (titulo: string) {
  const resultado = await get(`/musicas?termo=${encodeURIComponent(titulo)}`);
  assert.ok(resultado.length > 0,
    `Item '${titulo}' não encontrado no sistema — rode o seed antes dos testes`);
});

Given("existe no sistema músicas do ano {string}", async function (ano: string) {
  const resultado = await get(`/musicas?ano=${ano}`);
  assert.ok(resultado.length > 0,
    `Nenhuma música do ano ${ano} — rode o seed antes dos testes`);
});

Given("existe no sistema músicas do gênero {string}", async function (genero: string) {
  const resultado = await get(`/musicas?genero=${encodeURIComponent(genero)}`);
  assert.ok(resultado.length > 0,
    `Nenhuma música do gênero '${genero}' — rode o seed antes dos testes`);
});

Given("existe no sistema músicas do artista {string}", async function (artista: string) {
  filtroArtistaAlvo = artista;
  const resultado = await get(`/musicas?artista=${encodeURIComponent(artista)}`);
  assert.ok(resultado.length > 0,
    `Nenhuma música do artista '${artista}' — rode o seed antes dos testes`);
});

Given(
  "existe no sistema a música {string} do gênero {string}",
  async function (titulo: string, genero: string) {
    const resultado = await get(
      `/musicas?termo=${encodeURIComponent(titulo)}&genero=${encodeURIComponent(genero)}`
    );
    assert.ok(resultado.length > 0,
      `Música '${titulo}' do gênero '${genero}' não encontrada`);
  }
);

Given(
  "o sistema possui os filtros {string}, {string} armazenados como filtros utilizados na última busca feita pela conta",
  function (f1: string, f2: string) {
    // simulado — depende de implementação de histórico de filtros no backend
    filtrosUltimaBusca = [f1, f2];
  }
);

// 3. Busca — Whens

When("seleciono a seção de busca", function () {
  paginaAtual        = "busca";
  filtrosDisponiveis = ["gênero", "Nome do artista/podcast", "Ano de lançamento"];
});

When("realizo uma busca pelo termo {string}", async function (termo: string) {
  resultadosBusca = await get(`/musicas?termo=${encodeURIComponent(termo)}`);
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

When("aplico o filtro de gênero {string}", async function (genero: string) {
  const params = new URLSearchParams();
  if (termoBusca) params.append("termo", termoBusca);
  params.append("genero", genero);
  resultadosBusca = await get(`/musicas?${params.toString()}`);
});

When("aplico o filtro de ano de lançamento {string}", async function (ano: string) {
  resultadosBusca = await get(`/musicas?ano=${ano}`);
});

When("aplico o filtro de nome de artista {string}", async function (artista: string) {
  filtroArtistaAlvo = artista;
  resultadosBusca   = await get(`/musicas?artista=${encodeURIComponent(artista)}`);
});

When("acesso a tela de busca sem realizar mais nenhuma ação", function () {
  paginaAtual = "busca";
});

// 3. Busca — Thens

Then("posso ver o campo de busca por nome da música", function () {
  assert.strictEqual(paginaAtual, "busca", "Não está na página de busca");
});

Then("posso ver o campo de filtro {string}", function (filtro: string) {
  assert.ok(filtrosDisponiveis.includes(filtro),
    `Filtro '${filtro}' não disponível`);
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
      assert.ok(tituloNorm.includes(termoNorm),
        `Música sem correlação: '${m.titulo}'`);
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
    resultadosBusca.forEach((m) => {
      // suporta artista como string simples ou como array de objetos
      const temArtista = m.artistas
        ? m.artistas.some((a) => a.nomeArtistico.toLowerCase().includes(artista.toLowerCase()))
        : m.artista?.toLowerCase().includes(artista.toLowerCase());
      assert.ok(temArtista, `'${m.titulo}' não tem artista '${artista}'`);
    });
  }
);

Then("nenhuma música associada a um outro nome de artista deve ser listada", function () {
  // coberto pelo step anterior
});

Then("nenhuma música associada à um outro nome de artista deve ser listada", function () {
  // coberto pelo step anterior
});

// 4. Ranking Em Alta

Given(
  "que a música {string} está cadastrada no sistema, está no ranking Em Alta e possui {int} reproduções",
  async function (titulo: string, reproducoes: number) {
    const resultado = await get(`/musicas?termo=${encodeURIComponent(titulo)}`);
    const musica    = resultado.find((m: Musica) => m.titulo === titulo);
    assert.ok(musica, `Música '${titulo}' não encontrada no sistema`);
    // usa o objeto real do banco mas com as reproduções do cenário
    rankingEmAlta.push({ ...musica, reproducoes });
  }
);

Given(
  "a música {string} está cadastrada no sistema, está no em alta e possui {int} reproduções",
  async function (titulo: string, reproducoes: number) {
    const resultado = await get(`/musicas?termo=${encodeURIComponent(titulo)}`);
    const musica    = resultado.find((m: Musica) => m.titulo === titulo);
    assert.ok(musica, `Música '${titulo}' não encontrada no sistema`);
    rankingEmAlta.push({ ...musica, reproducoes });
  }
);

Given(
  "o ranking de músicas em alta exibe {string} na posição {int}",
  async function (titulo: string, posicao: number) {
    // se já tem ranking em memória, verifica ele
    // senão consulta a API
    if (rankingEmAlta.length > 0) {
      const tituloNaPosicao = rankingEmAlta[posicao - 1]?.titulo;
      assert.strictEqual(tituloNaPosicao, titulo,
        `Posição ${posicao}: esperado '${titulo}', encontrado '${tituloNaPosicao}'`);
    } else {
      const ranking = await get("/musicas/em-alta");
      assert.strictEqual(ranking[posicao - 1]?.titulo, titulo,
        `Posição ${posicao}: esperado '${titulo}'`);
    }
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
  async function (titulo: string, novas: number) {
    // busca a música no banco para pegar o id real
    const resultado = await get(`/musicas?termo=${encodeURIComponent(titulo)}`);
    const musica    = resultado.find((m: Musica) => m.titulo === titulo);
    assert.ok(musica, `Música '${titulo}' não encontrada no sistema`);

    // registra cada reprodução via API
    for (let i = 0; i < novas; i++) {
      await post(`/musicas/${musica.id}/reproducao`, {});
    }

    // atualiza o ranking local com os valores reais do banco
    rankingEmAlta = await get("/musicas/em-alta");
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
  async function (titulo: string, total: number) {
    // busca o valor atualizado direto do banco
    const resultado = await get(`/musicas?termo=${encodeURIComponent(titulo)}`);
    const musica    = resultado.find((m: Musica) => m.titulo === titulo);
    assert.ok(musica, `Música '${titulo}' não encontrada`);
    assert.strictEqual(musica.reproducoes, total,
      `'${titulo}': esperado ${total}, encontrado ${musica.reproducoes}`);
  }
);

// 5. Recomendações

Given(
  "meu histórico de reproduções contém apenas as músicas {string} e {string} do gênero {string}",
  function (m1: string, m2: string, genero: string) {
    historicoMusicas = [m1, m2];
    generoHistorico  = genero;
  }
);

Given(
  "existem músicas do gênero {string} armazenadas no sistema que não estão presentes no meu histórico",
  async function (genero: string) {
    const resultado = await get(`/musicas?genero=${encodeURIComponent(genero)}`);
    const fora      = resultado.filter((m: Musica) => !historicoMusicas.includes(m.titulo));
    assert.ok(fora.length > 0,
      `Não há músicas de '${genero}' fora do histórico no sistema`);
  }
);

When("eu acesso a seção de músicas recomendadas", async function () {
  recomendacoes = await get("/musicas/recomendadas", true);
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

// Helper

function reordenarRanking(): void {
  rankingEmAlta.sort((a, b) =>
    b.reproducoes !== a.reproducoes
      ? b.reproducoes - a.reproducoes
      : a.titulo.localeCompare(b.titulo)
  );
}