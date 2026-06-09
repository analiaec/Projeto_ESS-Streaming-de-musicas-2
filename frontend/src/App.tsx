import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }    from './contexts/AuthContext';
import { ToastProvider }   from './contexts/ToastContext';
import { ToastContainer }  from './components/Toast';
import { Home }            from './pages/Home';
import { EmAlta }          from './pages/EmAlta';
import { Busca }           from './pages/Busca';
import { Login }           from './pages/Login';
import { Recomendacoes }   from './pages/Recomendacoes';
import { Historico }       from './pages/Historico';
import { Register }        from './pages/Register';
import { AdminUsers }      from './pages/AdminUsers';
import { Playlists }       from './pages/Playlists';
import { Albuns }          from './pages/Albuns';
import { Podcasts }        from './pages/Podcasts';
import { PodcastPerfil }   from './pages/PodcastPerfil';
import { MeuPodcast }      from './pages/MeuPodcast';
import { AccountSettings } from './pages/AccountSettings';
import { UpdateAccount }   from './pages/UpdateAccount';
import { RemoveAccount }   from './pages/RemoveAccount';
import { SearchProvider } from './contexts/SearchContext';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>  
       <ToastProvider>
        <BrowserRouter>
          <ToastContainer />
          <Routes>
            <Route path="/"                element={<Home />}          />
            <Route path="/em-alta"         element={<EmAlta />}        />
            <Route path="/busca"           element={<Busca />}         />
            <Route path="/login"           element={<Login />}         />
            <Route path="/recomendacoes"   element={<Recomendacoes />} />
            <Route path="/historico"       element={<Historico />}     />
            <Route path="/playlists"       element={<Playlists />}     />
            <Route path="/albuns"          element={<Albuns />}        />
            <Route path="/auth/login"      element={<Login />}         />
            <Route path="/auth/register"   element={<Register />}      />
            <Route path="/admin/users"     element={<AdminUsers />}    />
            <Route path="/podcasts"        element={<Podcasts />}      />
            <Route path="/podcast/:login"  element={<PodcastPerfil />} />
            <Route path="/meu-podcast"     element={<MeuPodcast />}    />
            <Route path="/conta"           element={<AccountSettings />} />
            <Route path="/update-account"  element={<UpdateAccount />}   />
            <Route path="/remove-account"  element={<RemoveAccount />}   />
          </Routes>
         </BrowserRouter>
       </ToastProvider>
      </SearchProvider>  
    </AuthProvider>
  );
}

export default App;
