import { useEffect, useState } from 'react';
import { getUsersApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './AdminUsers.css';

export function AdminUsers() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [erro, setErro] = useState('');

  const { token } = useAuth();

  useEffect(() => {
  async function carregarUsuarios() {
    if (!token) {
      setErro('Usuário não autenticado');
      return;
    }

    try {
      const dados = await getUsersApi(token);
      setUsuarios(dados);
    } catch {
      setErro('Erro ao carregar usuários');
    }
  }

  carregarUsuarios();
}, [token]);

  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>

      {erro && <p>{erro}</p>}

      <table className="admin-table">
        <thead>
          <tr>
            <th>Login</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo de Conta</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.login}>
              <td>{usuario.login}</td>
              <td>{usuario.name}</td>
              <td>{usuario.email}</td>
              <td>{usuario.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/" >
      Voltar para Home
     </Link>
    </div>
  );
}