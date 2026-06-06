import { useState }     from 'react';
import { useNavigate }  from 'react-router-dom';
import { loginApi }     from '../api';
import { useAuth }      from '../contexts/AuthContext';

export function Login() {
  const [login,    setLogin]    = useState('');
  const [password, setPassword] = useState('');
  const [erro,     setErro]     = useState('');
  const { entrar }              = useAuth();
  const navigate                = useNavigate();

  async function handleLogin() {
    try {
      const dados = await loginApi(login, password);
      entrar(login, dados.access_token);
      navigate('/');
    } catch (e) {
      setErro('Login ou senha invalidos');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        placeholder="Login"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />
      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
      {erro && <p>{erro}</p>}
    </div>
  );
}