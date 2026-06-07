import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }  from './contexts/AuthContext';
import { Home }          from './pages/Home';
import { EmAlta }        from './pages/EmAlta';
import { Busca }         from './pages/Busca';
import { Login }         from './pages/Login';
import { Recomendacoes } from './pages/Recomendacoes';
import { Historico }     from './pages/Historico';
import { Register }      from './pages/Register';
import { AdminUsers }    from './pages/AdminUsers';
import { Playlists }     from './pages/Playlists';
import { Albuns }        from './pages/Albuns';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Home />}          />
          <Route path="/em-alta"       element={<EmAlta />}        />
          <Route path="/busca"         element={<Busca />}         />
          <Route path="/login"         element={<Login />}         />
          <Route path="/recomendacoes" element={<Recomendacoes />} />
          <Route path="/historico"     element={<Historico />}     />
          <Route path="/playlists"     element={<Playlists />}     />
          <Route path="/albuns"        element={<Albuns />}        />
          <Route path="/auth/login"    element={<Login />}         />
          <Route path="/auth/register" element={<Register />}      />
          <Route path="/admin/users"   element={<AdminUsers />}    />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;