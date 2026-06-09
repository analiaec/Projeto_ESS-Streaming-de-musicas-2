import axios from 'axios';

const LOGIN_PADRAO = 'LuisCardoso012';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({ baseURL: API_BASE });

// URL base do servidor (sem /api) — usada para montar caminhos de imagens
export const backendBaseUrl = API_BASE.replace(/\/api$/, '');

export const musicasUrl = (path: string) =>
  `/users/${LOGIN_PADRAO}/musicas${path}`;
export async function registerApi(
  login: string,
  name: string,
  password: string,
  email: string,
  tipodeconta: string,
  descricao?: string,
) {
  const res = await api.post('/auth/register', {
    login,
    name,
    password,
    email,
    tipodeconta,
    ...(descricao ? { descricao } : {}),
  });
  return res.data;
}
export async function loginApi(login: string, password: string) {
  const res = await api.post('/auth/login', { login, password });
  return res.data; // { access_token: '...' }
}
export async function getUsersApi(token: string) {
  const res = await api.get('/users', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

export async function updateUserApi(
  login: string,
  dados: any,
  token: string,
) {
  const res = await api.patch(
    `/users/${login}`,
    dados,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
}

export async function getAlbunsApi() {
  const res = await api.get('/albuns');
  return res.data;
}

export async function uploadAlbumImage(albumId: number, file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post(`/albuns/${albumId}/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function createPlaylist(data: { nome: string; descricao?: string; publica?: boolean; ownerLogin: string }) {
  const res = await api.post('/playlists', data);
  return res.data;
}

export async function updatePlaylist(id: number, data: { nome?: string; descricao?: string; publica?: boolean }) {
  const res = await api.patch(`/playlists/${id}`, data);
  return res.data;
}

export async function addMusicToPlaylistApi(playlistId: number, musicaId: number) {
  const res = await api.post(`/playlists/${playlistId}/musicas/${musicaId}`);
  return res.data;
}

export async function removeMusicFromPlaylistApi(playlistId: number, musicaId: number) {
  const res = await api.delete(`/playlists/${playlistId}/musicas/${musicaId}`);
  return res.data;
}

export async function deletePlaylist(id: number) {
  const res = await api.delete(`/playlists/${id}`);
  return res.data;
}

export async function getUserApi(login: string, token: string) {
  const res = await api.get(`/users/${login}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function removeUserApi(login: string, password: string | undefined, token: string) {
  const res = await api.delete(`/users/${login}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: password ? { password } : {},
  });
  return res.data;
}

export async function registerPodcasterApi(
  login: string,
  name: string,
  password: string,
  email: string,
  descricao: string,
) {
  const res = await api.post('/podcast', { login, name, password, email, descricao });
  return res.data;
}

// --- Podcast ---

export async function getPodcastsApi() {
  const res = await api.get('/podcast');
  return res.data;
}

export async function getPodcastApi(login: string) {
  const res = await api.get(`/podcast/${login}`);
  return res.data;
}

export async function getEpisodesApi(login: string) {
  const res = await api.get(`/podcast/${login}/episodes`);
  return res.data;
}

export async function getAllEpisodesApi(login: string) {
  const res = await api.get(`/podcast/${login}/episodes/all`);
  return res.data;
}

export async function getTotalAcessosApi(login: string) {
  const res = await api.get(`/podcast/${login}/acessos-total`);
  return res.data;
}

export async function createEpisodeApi(
  login: string,
  data: { titulo: string; arquivoUrl?: string; dataPublicacaoAgendada?: string },
  token: string,
) {
  const res = await api.post(`/podcast/${login}/episodes`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateEpisodeApi(
  login: string,
  episodeId: number,
  data: { titulo?: string; arquivoUrl?: string; dataPublicacaoAgendada?: string },
  token: string,
) {
  const res = await api.patch(`/podcast/${login}/episodes/${episodeId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function deleteEpisodeApi(login: string, episodeId: number, token: string) {
  const res = await api.delete(`/podcast/${login}/episodes/${episodeId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function playEpisodeApi(episodeId: number) {
  const res = await api.post(`/podcast/episodes/${episodeId}/play`);
  return res.data;
}

export async function downloadEpisodeApi(episodeId: number, userLogin: string) {
  const res = await api.get(`/podcast/episodes/${episodeId}/download`, {
    headers: { 'x-user-login': userLogin },
  });
  return res.data;
}