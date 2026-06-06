import axios from 'axios';

const LOGIN_PADRAO = 'LuisCardoso012';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
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