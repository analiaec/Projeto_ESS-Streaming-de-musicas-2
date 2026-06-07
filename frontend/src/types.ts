export interface Musica {
  id:          number;
  titulo:      string;
  reproducoes: number;
  artistas:    { login: string; nomeArtistico: string, }[];
  album:       { id: number; nome: string; capaUrl: string, generos: string, data:string };
}