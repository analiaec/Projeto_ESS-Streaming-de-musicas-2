import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home }   from './pages/Home';
import { Busca }  from './pages/Busca';
import { EmAlta } from './pages/EmAlta';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />}   />
        <Route path="/em-alta" element={<EmAlta />} />
        <Route path="/busca"   element={<Busca />}  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;