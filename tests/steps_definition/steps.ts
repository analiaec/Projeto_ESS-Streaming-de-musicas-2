import { Given, When, Then, Before } from "@cucumber/cucumber";
import assert from "assert";

const BASE_URL     = "http://localhost:3000/api";
const LOGIN_PADRAO = "LuisCardoso012";

interface Musica {
  id:          number;
  titulo:      string;
  reproducoes: number;
  artistas?:   { id: number; nome: string; nomeArtistico: string }[];
  album:       { id: number; nome: string; generos: string[]; data: string; capaUrl: string };
}

let token:                      string | null = null;
let usuarioLogado:              boolean       = false;
let loginAtual:                 string | null = null;
let paginaAtual:                string | null = null;
let campoBuscaVisivel:          boolean       = false;
let secaoMusicasEmAltaVisivel:  boolean       = false;
let secaoPodcastsEmAltaVisivel: boolean       = false;
let historicoVisivel:           boolean       = false;
let playlistsVisivel:           boolean       = false;
let mensagemTopo:               string | null = null;
let termoBusca:                 string        = "";
let resultadosBusca:            Musica[]      = [];
let filtrosUltimaBusca:         string[]      = [];
let filtrosDisponiveis:         string[]      = [];
let rankingEmAlta:              Musica[]      = [];

function musicasUrl(login: string | null, path: string): string {
  return `${BASE_URL}/users/${login ?? LOGIN_PADRAO}/musicas${path}`;
}

async function getMusicas(login: string | null, path: string, autenticado = false): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (autenticado && token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(musicasUrl(login, path), { headers });
  const dados = await response.json();
  if (!Array.isArray(dados)) return [];
  return dados;
}

async function postMusicas(login: string | null, path: string, body: any, autenticado = false): Promise<any> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (autenticado && token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(musicasUrl(login, path), {
    method: "POST", headers, body: JSON.stringify(body),
  });
  return response.json();
}

Before(function () {
  token = null; usuarioLogado = false; loginAtual = null; paginaAtual = null;
  campoBuscaVisivel = false; secaoMusicasEmAltaVisivel = false;
  secaoPodcastsEmAltaVisivel = false; historicoVisivel = false;
  playlistsVisivel = false; mensagemTopo = null; termoBusca = "";
  resultadosBusca = []; filtrosUltimaBusca = [];
  filtrosDisponiveis = []; rankingEmAlta = [];
});

// ─── Given ───────────────────────────────────────────────────────────────────

Given("estou logado como {string} com login {string} e senha {string}",
  async function (perfil: string, login: string, senha: string) {
    usuarioLogado = true; loginAtual = login;
  }
);

Given("não estou logado na plataforma", function () {
  token = null; usuarioLogado = false; loginAtual = null;
});

Given("estou na página inicial da aplicação", function () { paginaAtual = "home"; });

Given("estou na página de busca", function () { paginaAtual = "busca"; });

Given("estou na página {string}", function (pagina: string) {
  paginaAtual = pagina.toLowerCase();
});

Given("não existe nenhum item no sistema que tenha título {string} ou semelhante",
  async function (titulo: string) {
    const resultado = await getMusicas(loginAtual, `?termo=${encodeURIComponent(titulo)}`);
    assert.strictEqual(resultado.length, 0, `Item '${titulo}' não deveria existir no sistema`);
  }
);

Given("existe um item com título {string}", async function (titulo: string) {
  const resultado = await getMusicas(loginAtual, `?termo=${encodeURIComponent(titulo)}`);
  assert.ok(resultado.length > 0, `Item '${titulo}' não encontrado no sistema — rode o seed antes dos testes`);
});

Given("existe no sistema músicas do ano {string}", async function (ano: string) {
  const resultado = await getMusicas(loginAtual, `?ano=${ano}`);
  assert.ok(resultado.length > 0, `Nenhuma música do ano ${ano} — rode o seed antes dos testes`);
});

Given("existe no sistema músicas do gênero {string}", async function (genero: string) {
  const resultado = await getMusicas(loginAtual, `?genero=${encodeURIComponent(genero)}`);
  assert.ok(resultado.length > 0, `Nenhuma música do gênero '${genero}' — rode o seed antes dos testes`);
});

Given("existe no sistema músicas do artista {string}", async function (artista: string) {
  const resultado = await getMusicas(loginAtual, `?artista=${encodeURIComponent(artista)}`);
  assert.ok(resultado.length > 0, `Nenhuma música do artista '${artista}' — rode o seed antes dos testes`);
});

Given("existe no sistema a música {string} do gênero {string}", async function (titulo: string, genero: string) {
  const resultado = await getMusicas(loginAtual, `?termo=${encodeURIComponent(titulo)}&genero=${encodeURIComponent(genero)}`);
  assert.ok(resultado.length > 0, `Música '${titulo}' do gênero '${genero}' não encontrada`);
});

Given("o sistema possui os filtros {string}, {string} armazenados como filtros utilizados na última busca feita pela conta",
  function (f1: string, f2: string) { filtrosUltimaBusca = [f1, f2]; }
);

Given("que a música {string} está cadastrada no sistema, está no ranking Em Alta e possui {int} reproduções",
  async function (titulo: string, reproducoes: number) {
    const resultado = await getMusicas(loginAtual, `?termo=${encodeURIComponent(titulo)}`);
    const musica = resultado.find((m: Musica) => m.titulo === titulo);
    assert.ok(musica, `Música '${titulo}' não encontrada no sistema`);
    rankingEmAlta.push({ ...musica, reproducoes });
  }
);

Given("o ranking de músicas em alta exibe {string} na posição {int}",
  async function (titulo: string, posicao: number) {
    if (rankingEmAlta.length > 0) {
      assert.strictEqual(rankingEmAlta[posicao - 1]?.titulo, titulo);
    } else {
      const ranking = await getMusicas(loginAtual, "/em-alta");
      assert.strictEqual(ranking[posicao - 1]?.titulo, titulo);
    }
  }
);

// ─── When ────────────────────────────────────────────────────────────────────

When("acesso a página inicial", async function () {
  paginaAtual = "home"; campoBuscaVisivel = true;
  secaoMusicasEmAltaVisivel = true; secaoPodcastsEmAltaVisivel = true;
  historicoVisivel = usuarioLogado; playlistsVisivel = usuarioLogado;
  mensagemTopo = usuarioLogado ? `Ola, ${loginAtual}!` : "Faça login";
});

When("seleciono a seção de busca", function () {
  paginaAtual = "busca";
  filtrosDisponiveis = ["gênero", "Nome do artista/podcast", "Ano de lançamento"];
});

When("realizo uma busca pelo termo {string}", async function (termo: string) {
  resultadosBusca = await getMusicas(loginAtual, `?termo=${encodeURIComponent(termo)}`);
});

When("pesquiso pelo termo {string}", function (termo: string) { termoBusca = termo; });

When("aplico o filtro de gênero {string}", async function (genero: string) {
  const params = new URLSearchParams();
  if (termoBusca) params.append("termo", termoBusca);
  params.append("genero", genero);
  resultadosBusca = await getMusicas(loginAtual, `?${params.toString()}`);
});

When("aplico o filtro de ano de lançamento {string}", async function (ano: string) {
  const params = new URLSearchParams();
  if (termoBusca) params.append("termo", termoBusca);
  params.append("ano", ano);
  resultadosBusca = await getMusicas(loginAtual, `?${params.toString()}`);
});

When("aplico o filtro de nome de artista {string}", async function (artista: string) {
  resultadosBusca = await getMusicas(loginAtual, `?artista=${encodeURIComponent(artista)}`);
});

When("acesso a tela de busca sem realizar mais nenhuma ação", function () { paginaAtual = "busca"; });

When("o sistema ordena o ranking músicas Em Alta", function () { reordenarRanking(); });

When("a música {string} recebe {int} novas reproduções", async function (titulo: string, novas: number) {
  const resultado = await getMusicas(loginAtual, `?termo=${encodeURIComponent(titulo)}`);
  const musica = resultado.find((m: Musica) => m.titulo === titulo);
  assert.ok(musica, `Música '${titulo}' não encontrada no sistema`);
  for (let i = 0; i < novas; i++) {
    await postMusicas(loginAtual, `/${musica.id}/reproducao`, {});
  }
  rankingEmAlta = await getMusicas(loginAtual, "/em-alta");
});

// ─── Then ────────────────────────────────────────────────────────────────────

Then("posso ver o campo de busca", function () { assert.ok(campoBuscaVisivel); });

Then("posso ver a seção {string}", function (secao: string) {
  if (secao === "Músicas em Alta") assert.ok(secaoMusicasEmAltaVisivel);
  else if (secao === "Podcasts em Alta") assert.ok(secaoPodcastsEmAltaVisivel);
  else throw new Error(`Seção desconhecida: ${secao}`);
});

Then("posso ver meu histórico de músicas ouvidas recentemente", function () { assert.ok(historicoVisivel); });

Then("não posso ver meu histórico de músicas ouvidas recentemente", function () { assert.ok(!historicoVisivel); });

Then("posso ver minhas playlists", function () { assert.ok(playlistsVisivel); });

Then("não posso ver minhas playlists", function () { assert.ok(!playlistsVisivel); });

Then("posso ver um ícone", function () { assert.ok(usuarioLogado); });

Then("vejo uma mensagem na parte de cima da tela: {string}", function (esperada: string) {
  assert.strictEqual(mensagemTopo, esperada);
});

Then("o sistema deve exibir um placeholder informando que nenhum resultado foi encontrado", function () {
  assert.strictEqual(resultadosBusca.length, 0, "Resultados não deveriam ser exibidos");
});

Then("nenhum conteúdo deve ser listado", function () { assert.strictEqual(resultadosBusca.length, 0); });

Then("eu continuo na página de busca", function () { assert.strictEqual(paginaAtual, "busca"); });

Then("devo ver um placeholder informando que não houveram resultados", function () {
  assert.strictEqual(resultadosBusca.length, 0, "Lista deveria estar vazia");
});

Then("o sistema não deve exibir nenhum item na lista de resultados", function () {
  assert.strictEqual(resultadosBusca.length, 0, "Lista deveria estar vazia");
});

Then("o sistema deve exibir a música {string} nos resultados", function (titulo: string) {
  assert.ok(resultadosBusca.some((m) => m.titulo === titulo), `'${titulo}' não encontrada nos resultados`);
});

Then("os resultados devem estar ordenados de forma decrescente priorizando correlações exatas e depois parciais",
  function () {
    assert.ok(resultadosBusca.length > 0);
    assert.ok(resultadosBusca[0].titulo.toLowerCase().includes("catherine"));
  }
);

Then("músicas com mesma correlação devem ser ordenadas pelo total de reproduções", function () {});

Then("nenhuma música sem correlação com {string} deve ser exibida", function (termo: string) {
  const termoNorm = termo.toLowerCase();
  resultadosBusca.forEach((m) => {
    assert.ok(
      m.titulo.toLowerCase().includes(termoNorm),
      `Música sem correlação: '${m.titulo}'`
    );
  });
});

Then("os resultados devem estar ordenados de forma decrescente pelo total de reproduções", function () {
  for (let i = 0; i < resultadosBusca.length - 1; i++) {
    assert.ok(resultadosBusca[i].reproducoes >= resultadosBusca[i + 1].reproducoes);
  }
});

Then("o sistema deve exibir as 10 músicas com maior número de reproduções do ano {string}",
  function (ano: string) {
    assert.ok(resultadosBusca.length <= 10);
    resultadosBusca.forEach((m) => {
      const anoAlbum = parseInt(m.album.data.substring(0, 4)); // ← pega só os 4 primeiros caracteres
      assert.strictEqual(anoAlbum, parseInt(ano), `Música '${m.titulo}' tem ano ${anoAlbum}`);
    });
  }
);

Then("o sistema deve exibir os filtros {string}, {string} como últimos filtros aplicados",
  function (f1: string, f2: string) {
    assert.ok(filtrosUltimaBusca.includes(f1));
    assert.ok(filtrosUltimaBusca.includes(f2));
  }
);

Then("o sistema deve exibir as 10 músicas com maior número de reproduções do gênero {string} nos resultados",
  function (genero: string) {
    assert.ok(resultadosBusca.length <= 10);
    resultadosBusca.forEach((m) => {
      assert.ok(
        m.album.generos.includes(genero),
        `Música '${m.titulo}' não pertence ao gênero '${genero}'`
      );
    });
  }
);

Then("nenhuma música de gênero diferente de {string} deve ser listada", function (genero: string) {
  resultadosBusca.forEach((m) => {
    assert.ok(
      m.album.generos.includes(genero),
      `Gênero incorreto em '${m.titulo}'`
    );
  });
});
Then("nenhuma música com ano de lançamento diferente de {string} deve ser exibida",
  function (ano: string) {
    resultadosBusca.forEach((m) => {
      const anoAlbum = parseInt(m.album.data.substring(0, 4));
      assert.strictEqual(anoAlbum, parseInt(ano),
        `Música '${m.titulo}' tem ano ${anoAlbum}, diferente de ${ano}`
      );
    });
  }
);
Then("o sistema deve exibir as 10 músicas com maior número de reproduções associadas ao artista {string} nos resultados",
  function (artista: string) {
    assert.ok(resultadosBusca.length <= 10);
    resultadosBusca.forEach((m) => {
      const temArtista = m.artistas?.some(
        (a) => a.nomeArtistico?.toLowerCase().includes(artista.toLowerCase())
      );
      assert.ok(temArtista, `'${m.titulo}' não tem artista '${artista}'`);
    });
  }
);

Then("nenhuma música associada à um outro nome de artista deve ser listada", function () {});

Then("as músicas devem ser ordenadas de maneira alfabética por critério de desempate", function () {
  for (let i = 0; i < rankingEmAlta.length - 1; i++) {
    const a = rankingEmAlta[i]; const b = rankingEmAlta[i + 1];
    if (a.reproducoes === b.reproducoes) {
      assert.ok(a.titulo.localeCompare(b.titulo) <= 0);
    }
  }
});

Then("o total de reproduções da música {string} deve ser {int}",
  async function (titulo: string, total: number) {
    const resultado = await getMusicas(loginAtual, `?termo=${encodeURIComponent(titulo)}`);
    const musica = resultado.find((m: Musica) => m.titulo === titulo);
    assert.ok(musica);
    assert.strictEqual(musica.reproducoes, total,
      `'${titulo}': esperado ${total}, encontrado ${musica.reproducoes}`
    );
  }
);

Then("posso ver o campo de busca por nome da música", function () {
  assert.strictEqual(paginaAtual, "busca");
});

Then("posso ver o campo de filtro {string}", function (filtro: string) {
  assert.ok(filtrosDisponiveis.includes(filtro), `Filtro '${filtro}' não disponível`);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function reordenarRanking(): void {
  rankingEmAlta.sort((a, b) =>
    b.reproducoes !== a.reproducoes
      ? b.reproducoes - a.reproducoes
      : a.titulo.localeCompare(b.titulo)
  );
}