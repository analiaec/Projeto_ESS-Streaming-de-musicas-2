export interface Musica {
  titulo: string;
  genero: string;
  ano: number;
  artista: string;
  reproducoes: number;
}

export const CATALOGO: Musica[] = [
  { titulo: "MusicaBonita123",   genero: "Pop",        ano: 2020, artista: "Artista1",      reproducoes: 500  },
  { titulo: "Chega de Saudade",  genero: "Bossa Nova", ano: 1958, artista: "João Gilberto", reproducoes: 800  },
  { titulo: "Desafinado",        genero: "Bossa Nova", ano: 1959, artista: "João Gilberto", reproducoes: 750  },
  { titulo: "Garota de Ipanema", genero: "Bossa Nova", ano: 1962, artista: "Tom Jobim",     reproducoes: 950  },
  { titulo: "Se..",              genero: "MPB",        ano: 1990, artista: "Djavan",        reproducoes: 600  },
  { titulo: "Oceano",            genero: "MPB",        ano: 1989, artista: "Djavan",        reproducoes: 1000 },
  { titulo: "Sina",              genero: "MPB",        ano: 1990, artista: "Djavan",        reproducoes: 900  },
  { titulo: "Noel Clássico",     genero: "Samba",      ano: 1935, artista: "Noel Rosa",     reproducoes: 300  },
  { titulo: "Com Que Roupa",     genero: "Samba",      ano: 1931, artista: "Noel Rosa",     reproducoes: 400  },
  { titulo: "Mamãe Eu Quero",    genero: "Samba",      ano: 1994, artista: "Jararaca",      reproducoes: 200  },
  { titulo: "Swing da Cor",      genero: "Axé",        ano: 1994, artista: "Chiclete",      reproducoes: 450  },
];

export function buscar(
  termo: string | null,
  genero: string | null,
  ano: string | null,
  artista: string | null
): Musica[] {
  return CATALOGO.filter((m) => {
    if (termo   && !m.titulo.toLowerCase().includes(termo.toLowerCase()))  return false;
    if (genero  && m.genero  !== genero)                                   return false;
    if (ano     && m.ano     !== parseInt(ano))                            return false;
    if (artista && m.artista !== artista)                                  return false;
    return true;
  });
}

export function ordenarPorReproducoes(lista: Musica[]): Musica[] {
  return [...lista].sort((a, b) =>
    b.reproducoes !== a.reproducoes
      ? b.reproducoes - a.reproducoes
      : a.titulo.localeCompare(b.titulo)
  );
}
