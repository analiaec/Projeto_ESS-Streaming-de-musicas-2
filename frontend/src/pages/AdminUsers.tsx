import { useEffect, useState, useCallback } from 'react';
import { getUsersApi, updateUserApi }        from '../api';
import { useAuth }                           from '../contexts/AuthContext';
import { useToast }                          from '../contexts/ToastContext';
import { Navbar }                            from '../components/Navbar';
import './AdminUsers.css';

export function AdminUsers() {
  const { token }                                  = useAuth();
  const { toast }                                  = useToast();
  const [usuarios, setUsuarios]                    = useState<any[]>([]);
  const [erro, setErro]                            = useState('');
  const [editando, setEditando]                    = useState<any>(null);
  const [novoNome, setNovoNome]                    = useState('');
  const [novaSenha, setNovaSenha]                  = useState('');
  const [novoTipo, setNovoTipo]                    = useState('');
  const [erroEdicao, setErroEdicao]               = useState('');
  const [salvando, setSalvando]                    = useState(false);

  function selecionarUsuario(u: any) {
    setErroEdicao('');
    setEditando(u);
    setNovoNome(u.name ?? '');
    setNovaSenha('');
    setNovoTipo(u.tipodeconta ?? '');
  }

  async function salvar() {
    if (!token || !editando) return;
    const dados: any = {};
    if (novoNome.trim())                               dados.name = novoNome.trim();
    if (novaSenha.trim())                              dados.password = novaSenha.trim();
    if (novoTipo && novoTipo !== editando.tipodeconta) dados.role = novoTipo;

    if (Object.keys(dados).length === 0) {
      setErroEdicao('Altere pelo menos um campo.');
      return;
    }
    setSalvando(true);
    setErroEdicao('');
    try {
      await updateUserApi(editando.login, dados, token);
      await carregarUsuarios();
      setEditando(null);
      toast('Usuário atualizado com sucesso.', 'success');
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erro ao atualizar.';
      setErroEdicao(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSalvando(false);
    }
  }

  const carregarUsuarios = useCallback(async () => {
    if (!token) return;
    try {
      const dados = await getUsersApi(token);
      setUsuarios(dados);
    } catch {
      setErro('Erro ao carregar usuários.');
    }
  }, [token]);

  useEffect(() => { carregarUsuarios(); }, [carregarUsuarios]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>⚙️ Gerenciar Usuários</h1>

          {erro && <div className="alert alert-error">{erro}</div>}

          <div className="admin-table-wrap card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Login</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.login}>
                    <td className="admin-td-login">{u.login}</td>
                    <td>{u.name}</td>
                    <td className="admin-td-email">{u.email}</td>
                    <td>
                      <span className="badge admin-tipo-badge">{u.tipodeconta}</span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => selecionarUsuario(u)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editando && (
            <div className="admin-edit card">
              <h2 className="admin-edit-title">Editar <span className="admin-edit-login">@{editando.login}</span></h2>
              <div className="admin-edit-form">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input value={novoNome} onChange={e => setNovoNome(e.target.value)}
                    placeholder="Novo nome" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nova senha</label>
                  <input type="password" value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    placeholder="Deixe em branco para não alterar" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de conta</label>
                  <select value={novoTipo} onChange={e => setNovoTipo(e.target.value)}>
                    <option value="OUVINTE">OUVINTE</option>
                    <option value="ARTISTA">ARTISTA</option>
                    <option value="PODCASTER">PODCASTER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                {erroEdicao && <div className="alert alert-error">{erroEdicao}</div>}
                <div className="admin-edit-actions">
                  <button className="btn btn-primary btn-sm" onClick={salvar} disabled={salvando}>
                    {salvando ? 'Salvando…' : 'Salvar'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
