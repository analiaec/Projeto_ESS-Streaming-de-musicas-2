# Contexto do Projeto — Streaming de Músicas (Wave)

> Documento gerado em 2026-06-09 para uso em novas sessões Claude Code.
> Copie e cole este conteúdo no início de uma nova conversa para retomar o contexto.

---

## Visão Geral

Projeto acadêmico de plataforma de streaming de músicas/podcasts (similar ao Spotify), desenvolvido em Engenharia de Software. Stack: **NestJS + TypeORM + PostgreSQL** no backend, **React 19 + TypeScript + React Router v7** no frontend.

- **Repositório local:** `C:\Users\guerr\Downloads\Projeto_ESS-Streaming-de-musicas`
- **Branch principal:** `main`
- **Branch atual:** `feat/podcasts-refactor/frontend`
- **Git user:** pedrocag

---

## Como rodar localmente

### Backend
```bash
cd backend
npm install
npm run start:dev   # sobe em http://localhost:3000/api
```

### Frontend
```bash
cd frontend
npm install
npm start           # sobe em http://localhost:3001
```

### Seed (dados de teste)
```bash
cd backend
npm run seed
```

### Testes
```bash
# Unitários (Jest)
npm test
npm test -- --testPathPattern=users.service.spec.ts   # arquivo específico

# BDD (Cucumber)
npm run test:bdd                                              # todos
npm run test:bdd -- features/users/user_registration.feature  # arquivo específico
npm run test:bdd -- features/users/                           # pasta inteira
```

---

## Stack Técnica

### Backend
- **Framework:** NestJS 11
- **ORM:** TypeORM 0.3 + PostgreSQL (`pg`)
- **Auth:** JWT (passport-jwt), segredo `wave-secret`, expiração 1 dia
- **Validação:** class-validator + class-transformer (ValidationPipe global)
- **Testes unitários:** Jest + ts-jest (config em `jest.config.cjs`, rootDir: `src`)
- **Testes BDD:** Cucumber.js 12 (config em `cucumber.json`)
- **Dev server:** ts-node-dev

### Frontend
- **Framework:** React 19 + TypeScript
- **Roteamento:** React Router v7
- **HTTP:** Axios (BASE_URL: `http://localhost:3000/api`)
- **Estado global:** Context API (Auth, Theme, Toast)
- **Estilo:** CSS puro com variáveis CSS (design system dark/light)

---

## Banco de dados

**PostgreSQL** rodando em localhost:5432, database `streaming`.

Variáveis de ambiente do backend (`.env` ou padrão hardcoded):
- DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
- TypeORM `synchronize: true` — schema auto-sincronizado

---

## Entidades (TypeORM)

### User (`users` table)
```ts
login: string           // PrimaryColumn — identificador único
name: string
password: string        // PLAINTEXT — sem hash/bcrypt
email: string           // Unique
tipodeconta: UserRole   // enum: OUVINTE | ARTISTA | PODCASTER | ADMIN
```

### Playlist (`playlists` table)
```ts
id: number              // PrimaryGeneratedColumn
nome: string
descricao?: string      // nullable
publica: boolean        // default true
ownerLogin: string      // FK para User.login
seguidores: string[]    // PostgreSQL text[] array, default []
musicas: Musica[]       // ManyToMany via playlist_musicas
```

### Musica (`musicas` table)
```ts
id: number
titulo: string
reproducoes: number     // default 0
arquivoUrl?: string     // nullable
album: Album            // ManyToOne
artistas: Artista[]     // ManyToMany via musica_artistas
```

### Album (`albuns` table)
```ts
id: number
nome: string
capaUrl?: string
imageUrl?: string
data: string            // ISO date string
generos: string[]       // PostgreSQL array
artistas: Artista[]     // ManyToMany via album_artistas
musicas: Musica[]       // OneToMany (cascade delete)
```

### Podcast (`podcast` table — estende User)
```ts
// herda todos os campos de User
descricao: string
```

### Episode (`episodes` table)
```ts
id: number
titulo: string
arquivoUrl?: string
reproducoes: number
publicado: boolean
publicadoEm?: string
dataPublicacaoAgendada?: string
```

---

## Módulos do Backend (`backend/src/`)

| Módulo | Rotas base | Notas |
|--------|-----------|-------|
| `auth` | `/auth/register`, `/auth/login` | JWT gerado aqui |
| `users` | `/users` | CRUD completo, JWT guard |
| `playlists` | `/playlists` | Inclui follow/unfollow, add/remove músicas |
| `musicas` | `/musicas` | Busca e CRUD |
| `albuns` | `/albuns` | CRUD + upload de capa |
| `artistas` | `/artistas` | CRUD |
| `podcast` | `/podcast` | CRUD podcaster + episódios |
| `episodes` | (dead code) | Não conectado a rotas reais |
| `programas` | (dead code) | Ignorar |
| `scores` | `/scores` | Pontuações |
| `playback` | `/playback` | Histórico de reprodução |

---

## Rotas Importantes

### Auth
```
POST /auth/register   — cria conta (bloqueia role ADMIN)
POST /auth/login      — retorna { token, role }
```

### Users
```
POST   /users             — cria usuário
GET    /users             — lista todos (JWT)
GET    /users/:login      — busca por login (JWT)
PATCH  /users/:login      — atualiza (JWT, owner ou ADMIN)
DELETE /users/:login      — remove (JWT, owner ou ADMIN)
```

### Playlists
```
POST   /playlists                        — cria
GET    /playlists                        — lista todas
GET    /playlists/:id                    — detalhe com músicas
PATCH  /playlists/:id                    — atualiza metadados
DELETE /playlists/:id                    — remove
POST   /playlists/:id/musicas/:musicaId  — adiciona música
DELETE /playlists/:id/musicas/:musicaId  — remove música
POST   /playlists/:id/seguir             — segue (body: { userLogin })
DELETE /playlists/:id/seguir             — deixa de seguir (body: { userLogin })
```

### Podcast
```
POST   /podcast                              — criar podcaster
GET    /podcast                              — listar todos
GET    /podcast/:login                       — perfil
PATCH  /podcast/:login                       — atualizar
DELETE /podcast/:login                       — remover
POST   /podcast/:login/episodes              — criar episódio
GET    /podcast/:login/episodes              — listar episódios publicados
PATCH  /podcast/:login/episodes/:episodeId   — atualizar
DELETE /podcast/:login/episodes/:episodeId   — deletar
POST   /podcast/episodes/:episodeId/play     — registrar reprodução
GET    /podcast/:login/acessos-total         — total de acessos
GET    /podcast/episodes/:episodeId/download — download (header x-user-login)
```

---

## Lógica de Negócio Relevante

### users.service.ts
- `update()` — valida campos vazios e mesmo valor atual; retorna `{ message, user }`
- `remove()` — sempre verifica senha se `removeUserDto.password` for fornecida; retorna `{ message, user }`
- `findByEmail()` — busca por email (usado em verificação de duplicata)
- Mapeamento de nomes de campo: `password→senha`, `name→nome`, `tipodeconta→tipo de conta`
- Senhas em **plaintext** (sem bcrypt)

### users.controller.ts
- Admin pode operar em qualquer usuário, mas **sempre passa o body** para o service (sem bypass de senha)
- Nenhum usuário pode se autopromover para ADMIN via PATCH

### playlists.service.ts
- `seguir()` — idempotente (não duplica seguidores)
- `desseguir()` — filtra o login da lista
- `findOne()` inclui relações completas (músicas → álbum → artistas)

### auth.service.ts
- Bloqueia registro com `tipodeconta: ADMIN`
- JWT payload: `{ sub: login, role: tipodeconta }`
- Segredo JWT: `'wave-secret'`

---

## Frontend — Estrutura

### Contextos
| Contexto | Arquivo | localStorage key |
|---------|---------|-----------------|
| Auth | `AuthContext.tsx` | `wv_login`, `wv_token`, `wv_role` |
| Theme | `ThemeContext.tsx` | `wv_theme` |
| Toast | `ToastContext.tsx` | — |

### Tema (Dark/Light)
- CSS variables em `:root` (dark default) + `[data-theme="light"]` override
- ThemeContext aplica `data-theme` no `<html>` element
- Toggle button (☀️/🌙) na Navbar, à esquerda do usuário logado
- Variável `--navbar-bg: rgba(10, 10, 10, 0.92)` (dark) / overrideada no light

### Rotas do Frontend
```
/                  — Home
/em-alta           — Em Alta
/busca             — Busca
/login             — Login
/auth/login        — Login (alias)
/auth/register     — Registro
/historico         — Histórico (requer login)
/recomendacoes     — Para Você (requer login)
/playlists         — Playlists (requer login)
/albuns            — Álbuns (requer login)
/conta             — Account Settings (requer login)
/update-account    — Editar conta (requer login)
/remove-account    — Excluir conta (requer login)
/admin/users       — Gerenciar usuários (requer ADMIN)
/meu-podcast       — Dashboard podcaster (requer PODCASTER)
/podcasts          — Lista de podcasts (público)
/podcast/:login    — Perfil do podcaster (público)
```

### api.ts — Funções principais
```ts
// Auth
registerApi(data)
loginApi(data)

// Users
getUsersApi(token)
updateUserApi(login, data, token)
removeUserApi(login, password, token)

// Playlists
createPlaylist(data, token)
updatePlaylist(id, data, token)
deletePlaylist(id, token)
followPlaylistApi(playlistId, userLogin)
unfollowPlaylistApi(playlistId, userLogin)
addMusicToPlaylistApi(playlistId, musicaId)
removeMusicFromPlaylistApi(playlistId, musicaId)

// Álbuns
getAlbunsApi()
uploadAlbumImage(id, file, token)

// Podcasts
getPodcastsApi()
getPodcastApi(login)
getEpisodesApi(login)
getAllEpisodesApi(login, token)
createEpisodeApi(login, data, token)
updateEpisodeApi(login, id, data, token)
deleteEpisodeApi(login, id, token)
playEpisodeApi(episodeId)
downloadEpisodeApi(id, userLogin)
getTotalAcessosApi(login)
```

### Playlists.tsx — Lógica de Visibilidade
```ts
// O backend retorna todas as playlists — o filtro é feito no frontend:
const ownPlaylists = playlists.filter(pl => pl.ownerLogin === login);
const otherPlaylists = playlists.filter(
  pl => pl.ownerLogin !== login && pl.publica
);
// Playlists privadas de terceiros NUNCA são exibidas
```

- Share link: `${window.location.origin}/playlists?pl=${pl.id}` (copiado via `navigator.clipboard.writeText`)
- Auto-expand: `useLocation` lê `?pl=ID` na montagem para abrir playlist compartilhada

---

## Testes

### Unitários — `users.service.spec.ts`
Cobre: `create`, `findAll`, `findOne`, `findByLogin`, `findByEmail`, `update`, `remove`

Casos especiais:
- `update` com mesmo valor → `BadRequestException`
- `update` com usuário inexistente → `NotFoundException`
- `remove` com senha errada → `UnauthorizedException`

### BDD — `features/users/`

| Feature file | Cenários |
|-------------|---------|
| `user_registration.feature` | 6 cenários: registro válido, login duplicado, senha curta, campo vazio, senha longa, email inválido |
| `account_management.feature` | 6 cenários: update sucesso, mesmo valor, valor inválido, body vazio, remoção com senha certa, senha errada |
| `users_management.feature` | 8 cenários: admin CRUD em outro usuário, tentativas não autorizadas |

**`cucumber.json`** — sem chave `"paths"` (para que `npm run test:bdd -- features/users/user_registration.feature` rode apenas esse arquivo):
```json
{
  "default": {
    "require": ["step_definitions/**/*.ts", "features/**/*.js"],
    "requireModule": ["ts-node/register"],
    "format": ["progress-bar", "html:reports/cucumber-report.html"],
    "tags": "not @ignore",
    "publishQuiet": true
  }
}
```

---

## Seed (`npm run seed`)

Usuários criados:
- `LuisCardoso012` / senha `Luis@123` / OUVINTE / luis@example.com
- `Usuario` / senha `usuario123` / OUVINTE / usuario@example.com
- `admin` / senha `admin123` / ADMIN / admin@wave.com

Conteúdo: 8 artistas, 11 álbuns, 16 músicas, 3 podcasters com episódios.

---

## Decisões Técnicas Importantes

1. **Senhas em plaintext** — sem bcrypt, por ser projeto acadêmico. Não mudar sem alinhar com o time.

2. **Array de seguidores como `text[]` do PostgreSQL** — TypeORM: `@Column({ type: 'text', array: true, default: () => "ARRAY[]::text[]" })`. TypeORM `synchronize: true` cria a coluna automaticamente.

3. **Admin deve sempre fornecer senha do alvo para remover** — o controller sempre passa `body` para `service.remove()`, sem bypass. Decisão tomada para alinhar com os cenários BDD.

4. **Nenhum usuário pode se registrar como ADMIN** — bloqueado em `auth.service.ts`. Apenas via seed ou promoção manual no banco.

5. **`cucumber.json` sem `"paths"`** — necessário para que o argumento CLI de caminho seja respeitado. Sem isso, todos os features eram executados sempre.

6. **Frontend filtra playlists privadas** — o backend retorna tudo; o frontend nunca exibe playlists `publica: false` de outros usuários. Sem mudança no backend necessária.

7. **JWT secret hardcoded** — `'wave-secret'` em `auth.module.ts`. Para produção precisaria de env var.

---

## Arquivos Chave por Área

### Backend
- `src/app.module.ts` — importa todos os módulos e configura TypeORM
- `src/main.ts` — bootstrap NestJS, ValidationPipe global
- `src/seed.ts` — script de seed
- `src/auth/auth.module.ts` — configura JwtModule
- `src/auth/jwt-auth.guard.ts` — guard reutilizado
- `src/auth/jwt.strategy.ts` — extrai `sub` e `role` do token

### Frontend
- `src/App.tsx` — toda a árvore de provedores e rotas
- `src/api.ts` — todas as chamadas HTTP
- `src/index.css` — design system completo (variables, reset, base)
- `src/contexts/ThemeContext.tsx` — dark/light mode
- `src/contexts/AuthContext.tsx` — login/logout state
- `src/components/Navbar.tsx` — navegação principal

---

## Problemas Conhecidos / Observações

- `episodes/episodes.service.ts` e `programas/` são dead code — não mexer
- `Register.tsx` tem campo `description` para PODCAST mas não o envia na API — workaround é criar podcasters via `POST /podcast` direto
- `scores/` e `playback/` existem mas não têm frontend ainda
- `src/test/java/` é um artefato de outro framework (Java/Cucumber) — ignorar
- `jest.config.ts` existe dentro de `src/` mas a config real usada é `jest.config.cjs` na raiz do backend
