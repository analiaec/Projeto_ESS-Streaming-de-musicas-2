import axios from 'axios';

const LOGIN_PADRAO = 'LuisCardoso012';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const musicasUrl = (path: string) =>
  `/users/${LOGIN_PADRAO}/musicas${path}`;