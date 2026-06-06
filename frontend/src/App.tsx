import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home }         from './pages/Home';
import { EmAlta }       from './pages/EmAlta';
import { Busca }        from './pages/Busca';
import { Login }        from './pages/Login';
import { Recomendacoes } from './pages/Recomendacoes';
import { Historico }    from './pages/Historico'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Home />}   />
          <Route path="/em-alta" element={<EmAlta />} />
          <Route path="/busca"   element={<Busca />}  />
          <Route path="/login"   element={<Login />}  />
          <Route path="/recomendacoes"   element={<Recomendacoes />}  />
          <Route path="/historico"       element={<Historico  />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;