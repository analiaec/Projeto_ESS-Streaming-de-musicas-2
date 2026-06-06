import { useEffect, useState, useCallback } from 'react';
import { getUsersApi, updateUserApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './AdminUsers.css';

export function AdminUsers() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [erro, setErro] = useState('');
  const { token } = useAuth();
  const [usuarioEditando, setUsuarioEditando] = useState<any>(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoTipo, setNovoTipo] = useState('');
  const [erroAtualizacao, setErroAtualizacao] = useState('');

  function selecionarUsuario(usuario: any) {
    setErroAtualizacao('');
    setUsuarioEditando(usuario);
    setNovoNome(usuario.name);
    setNovaSenha('');
    setNovoTipo(usuario.tipodeconta);
  }

  async function salvarAlteracoes() {
  if (!token) return;

  const dadosAtualizacao: any = {};

  if (novoNome.trim() !== '') {
    dadosAtualizacao.name = novoNome;
  }

  if (novaSenha.trim() !== '') {
    dadosAtualizacao.password = novaSenha;
  }

  if (novoTipo !== '' && novoTipo !== usuarioEditando.role) {
    dadosAtualizacao.role = novoTipo;
  }

  if (Object.keys(dadosAtualizacao).length === 0) {
    alert('Preencha pelo menos um campo para atualizar.');
    return;
  }

  try {
    await updateUserApi(
      usuarioEditando.login,
      dadosAtualizacao,
      token,
    );
    setErroAtualizacao('');
    await carregarUsuarios();
    alert('Usuário atualizado.');
    setUsuarioEditando(null);
  } catch (e: any) {
  const mensagem =
    e.response?.data?.message ||
    'Erro ao atualizar usuário.';

  setErroAtualizacao(
    Array.isArray(mensagem)
      ? mensagem[0]
      : mensagem
  );
}
}

const carregarUsuarios = useCallback(async () => {
  if (!token) return;

  try {
    const dados = await getUsersApi(token);
    setUsuarios(dados);
  } catch {
    setErro('Erro ao carregar usuários');
  }
}, [token]);

 useEffect(() => {
  carregarUsuarios();
}, [carregarUsuarios]);


  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>

      {erro && <p>{erro}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Login</th>
            <th>Nome</th>
            <th>Senha</th>
            <th>Email</th>
            <th>Tipo de Conta</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.login}>
              <td>{usuario.login}</td>
              <td>{usuario.name}</td>
              <td>{usuario.password}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipodeconta}</td>
              <td><button onClick={() => selecionarUsuario(usuario)}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {usuarioEditando && (
        <div className="editar-usuario">

            <h2>Editar Usuário</h2>

            <p>Login: {usuarioEditando.login}</p>

            <input
            placeholder="Nome"
            value={novoNome}
            onChange={e => setNovoNome(e.target.value)}
            />

            <input
            type="password"
            placeholder="Nova senha"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            />

            <select
            value={novoTipo}
            onChange={e => setNovoTipo(e.target.value)}
            >
            <option value="OUVINTE">OUVINTE</option>
            <option value="ARTISTA">ARTISTA</option>
            <option value="PODCAST">PODCAST</option>
            <option value="ADMIN">ADMIN</option>
            </select>

            <button onClick={salvarAlteracoes}>
            Salvar
            </button>

        </div>
        )}
        {erroAtualizacao && (
        <p className="erro">
            {erroAtualizacao}
        </p>
        )}
      <Link to="/" >
      Voltar para Home
     </Link>
    </div>
  );
}