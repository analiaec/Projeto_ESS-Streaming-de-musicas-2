import { useState }     from 'react';
import { useNavigate }  from 'react-router-dom';
import { loginApi }     from '../api';
import { useAuth }      from '../contexts/AuthContext';
import './Login.css'

export function Login() {
  const [login,    setLogin]    = useState('');
  const [password, setPassword] = useState('');
  const [erro,     setErro]     = useState('');
  const { entrar }              = useAuth();
  const navigate                = useNavigate();

  async function handleLogin() {
    try {
      const dados = await loginApi(login, password);
      entrar(login, dados.access_token, dados.role);
      navigate('/');
    } catch (e) {
      setErro('Login ou senha inválidos');
    }
  }

  return ( 
    <div>
      <h1>Login</h1>
      <div className="botoes-login">
      <input
        className="campo-login"
        placeholder="Login"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />
      <input
        className="campo-senha"
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      /></div>
      <div className="botoes-login">
      <button className="botao-entrar" onClick={handleLogin}>Entrar</button>
      <button className="botao-criar" onClick={() => navigate('/auth/register')}>Criar conta</button>
      </div>
      {erro && <p>{erro}</p>}
    </div>
  );
}