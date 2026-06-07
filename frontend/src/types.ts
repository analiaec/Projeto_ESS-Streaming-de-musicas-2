export interface Musica {
  id:          number;
  titulo:      string;
  genero:      string;
  ano:         number;
  reproducoes: number;
  artistas:    { login: string; nomeArtistico: string }[];
  album:       { id: number; nome: string; capaUrl: string };
}