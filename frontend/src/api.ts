import axios from 'axios';

const LOGIN_PADRAO = 'LuisCardoso012';

// Allow overriding with REACT_APP_API_URL env var, default to backend on port 3001
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

export const musicasUrl = (path: string) =>
  `/users/${LOGIN_PADRAO}/musicas${path}`;
export async function registerApi(
  login: string,
  name: string,
  password: string,
  email: string,
  tipodeconta: string,
) {
  const res = await api.post('/auth/register', {
    login,
    name,
    password,
    email,
    tipodeconta,
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

export async function deletePlaylist(id: number) {
  const res = await api.delete(`/playlists/${id}`);
  return res.data;
}