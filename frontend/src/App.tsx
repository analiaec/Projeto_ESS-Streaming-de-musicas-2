import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Home }         from './pages/Home';
import { EmAlta }       from './pages/EmAlta';
import { Busca }        from './pages/Busca';
import { Login }        from './pages/Login';
import { Register } from './pages/Register';
import { AdminUsers } from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"        element={<Home />}   />
          <Route path="/em-alta" element={<EmAlta />} />
          <Route path="/busca"   element={<Busca />}  />
          <Route path="/auth/login"   element={<Login />}  />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;