import React, { useEffect, useState, useCallback } from 'react';
import { getUsersApi, updateUserApi, removeUserApi } from '../api';
import { api }                                       from '../api';
import { useAuth }                                   from '../contexts/AuthContext';
import { useToast }                                  from '../contexts/ToastContext';
import { Navbar }                                    from '../components/Navbar';
import './AdminUsers.css';

const TIPOS = ['OUVINTE', 'ARTISTA', 'PODCASTER', 'ADMIN'];

export function AdminUsers() {
  const { token, login: adminLogin } = useAuth();
  const { toast }                    = useToast();
  const [usuarios,   setUsuarios]    = useState<any[]>([]);
  const [erro,       setErro]        = useState('');
  const [editando,   setEditando]    = useState<any>(null);
  const [novoNome,   setNovoNome]    = useState('');
  const [novaSenha,  setNovaSenha]   = useState('');
  const [novoTipo,   setNovoTipo]    = useState('');
  const [erroEdicao, setErroEdicao]  = useState('');
  const [salvando,   setSalvando]    = useState(false);

  // criar usuário
  const [criando,    setCriando]     = useState(false);
  const [noLogin,    setNoLogin]     = useState('');
  const [noNome,     setNoNome]      = useState('');
  const [noSenha,    setNoSenha]     = useState('');
  const [noEmail,    setNoEmail]     = useState('');
  const [noTipo,     setNoTipo]      = useState('OUVINTE');
  const [erroCriacao,setErroCriacao] = useState('');
  const [salvandoCr, setSalvandoCr]  = useState(false);

  const carregarUsuarios = useCallback(async () => {
    if (!token) return;
    try {
      setErro('');
      const dados = await getUsersApi(token);
      setUsuarios(dados);
    } catch {
      setErro('Erro ao carregar usuários.');
    }
  }, [token]);

  useEffect(() => { carregarUsuarios(); }, [carregarUsuarios]);

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
    if (novoNome.trim() && novoNome !== editando.name)         dados.name        = novoNome.trim();
    if (novaSenha.trim())                                      dados.password    = novaSenha.trim();
    if (novoTipo && novoTipo !== editando.tipodeconta)         dados.tipodeconta = novoTipo;

    if (Object.keys(dados).length === 0) { setErroEdicao('Altere pelo menos um campo.'); return; }
    setSalvando(true); setErroEdicao('');
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

  async function excluir(login: string) {
    if (!token) return;
    if (!window.confirm(`Excluir o usuário "${login}"? Esta ação é irreversível.`)) return;
    try {
      await removeUserApi(login, undefined, token);
      await carregarUsuarios();
      if (editando?.login === login) setEditando(null);
      toast(`Usuário @${login} excluído.`, 'info');
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erro ao excluir.';
      toast(Array.isArray(msg) ? msg[0] : msg, 'error');
    }
  }

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setErroCriacao('');
    if (!noLogin.trim() || !noNome.trim() || !noSenha.trim() || !noEmail.trim()) {
      setErroCriacao('Preencha todos os campos.'); return;
    }
    setSalvandoCr(true);
    try {
      await api.post('/users', { login: noLogin.trim(), name: noNome.trim(), password: noSenha.trim(), email: noEmail.trim(), tipodeconta: noTipo });
      await carregarUsuarios();
      setNoLogin(''); setNoNome(''); setNoSenha(''); setNoEmail(''); setNoTipo('OUVINTE');
      setCriando(false);
      toast('Usuário criado com sucesso.', 'success');
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erro ao criar usuário.';
      setErroCriacao(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSalvandoCr(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>⚙️ Gerenciar Usuários</h1>

          {erro && <div className="alert alert-error">{erro}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
            <button className="btn btn-primary btn-sm" onClick={() => { setCriando(c => !c); setErroCriacao(''); }}>
              {criando ? '✕ Cancelar' : '+ Novo Usuário'}
            </button>
          </div>

          {criando && (
            <div className="admin-edit card" style={{ marginBottom: '1rem' }}>
              <h2 className="admin-edit-title">Criar Usuário</h2>
              <form className="admin-edit-form" onSubmit={criarUsuario}>
                <div className="form-group">
                  <label className="form-label">Login</label>
                  <input value={noLogin} onChange={e => setNoLogin(e.target.value)} placeholder="login único" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input value={noNome} onChange={e => setNoNome(e.target.value)} placeholder="Nome completo" />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input type="email" value={noEmail} onChange={e => setNoEmail(e.target.value)} placeholder="email@exemplo.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Senha</label>
                  <input type="password" value={noSenha} onChange={e => setNoSenha(e.target.value)} placeholder="Senha" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de conta</label>
                  <select value={noTipo} onChange={e => setNoTipo(e.target.value)}>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {erroCriacao && <div className="alert alert-error">{erroCriacao}</div>}
                <button type="submit" className="btn btn-primary btn-sm" disabled={salvandoCr}>
                  {salvandoCr ? 'Criando…' : 'Criar'}
                </button>
              </form>
            </div>
          )}

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
                    <td><span className="badge admin-tipo-badge">{u.tipodeconta}</span></td>
                    <td style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => selecionarUsuario(u)}>
                        Editar
                      </button>
                      {u.login !== adminLogin && (
                        <button className="btn btn-danger btn-sm" onClick={() => excluir(u.login)}>
                          Excluir
                        </button>
                      )}
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
                  <input value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="Novo nome" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nova senha</label>
                  <input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Deixe em branco para não alterar" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipo de conta</label>
                  <select value={novoTipo} onChange={e => setNovoTipo(e.target.value)}>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                {erroEdicao && <div className="alert alert-error">{erroEdicao}</div>}
                <div className="admin-edit-actions">
                  <button className="btn btn-primary btn-sm" onClick={salvar} disabled={salvando}>
                    {salvando ? 'Salvando…' : 'Salvar'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditando(null)}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
