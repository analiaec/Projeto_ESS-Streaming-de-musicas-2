import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../api';

export function Register() {
  const [login, setLogin] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [tipodeconta, settipodeconta] = useState('OUVINTE');
  const [description, setDescription] = useState('');

  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      // futuramente aqui vai chamar a API

      await registerApi(
      login,
      name,
      password,
      email,
      tipodeconta,
    );

      navigate('/');
    } catch (e: any) {
  const mensagem =
    e.response?.data?.message ||
    'Erro ao realizar cadastro';

  setErro(
    Array.isArray(mensagem)
      ? mensagem[0]
      : mensagem
  );
}
  }

  return (
    <div>
      <h1>Cadastro</h1>

      <input
        placeholder="Login"
        value={login}
        onChange={e => setLogin(e.target.value)}
      />

      <input
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        placeholder="Senha"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <select
        value={tipodeconta}
        onChange={e => settipodeconta(e.target.value)}
      >
        <option value="OUVINTE">Ouvinte</option>
        <option value="ARTISTA">Artista</option>
        <option value="PODCAST">Podcast</option>
      </select>

      {(tipodeconta === 'ARTISTA' || tipodeconta === 'PODCAST') && (
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      )}

      <button onClick={handleRegister}>Cadastrar</button>
      <button onClick={() => navigate('/auth/login')}>Voltar para Login</button>
      {erro && <p>{erro}</p>}
    </div>
  );
}