import { createContext, useContext, useState, ReactNode } from 'react';

interface FiltrosBusca {
  termo:   string;
  genero:  string;
  artista: string;
}

interface SearchContextType {
  ultimosFiltros:    FiltrosBusca;
  salvarFiltros:     (filtros: FiltrosBusca) => void;
  limparFiltros:     () => void;
}

const filtrosVazios: FiltrosBusca = {
  termo:   '',
  genero:  '',
  artista: '',
};

const SearchContext = createContext<SearchContextType>({} as SearchContextType);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [ultimosFiltros, setUltimosFiltros] = useState<FiltrosBusca>(filtrosVazios);

  function salvarFiltros(filtros: FiltrosBusca) {
    if (filtros.termo || filtros.genero || filtros.artista) {
      setUltimosFiltros(filtros);
    }
  }

  function limparFiltros() {
    setUltimosFiltros(filtrosVazios);
  }

  return (
    <SearchContext.Provider value={{ ultimosFiltros, salvarFiltros, limparFiltros }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}