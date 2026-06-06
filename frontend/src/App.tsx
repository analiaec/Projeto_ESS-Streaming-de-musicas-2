import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home }         from './pages/Home';
import { EmAlta }       from './pages/EmAlta';
import { Busca }        from './pages/Busca';
import { Login }        from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Home />}   />
          <Route path="/em-alta" element={<EmAlta />} />
          <Route path="/busca"   element={<Busca />}  />
          <Route path="/login"   element={<Login />}  />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;