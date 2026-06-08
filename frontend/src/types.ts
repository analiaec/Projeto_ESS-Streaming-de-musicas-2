export interface Musica {
  id:          number;
  titulo:      string;
  reproducoes: number;
  artistas:    { login: string; nomeArtistico: string, }[];
  album:       { id: number; nome: string; capaUrl: string, generos: string, data:string };
}

export interface Podcast {
  login:      string;
  name:       string;
  email:      string;
  descricao:  string;
}

export interface Episode {
  id:                       number;
  titulo:                   string;
  reproducoes:              number;
  arquivoUrl:               string | null;
  publicado:                boolean;
  publicadoEm:              string | null;
  dataPublicacaoAgendada:   string | null;
}