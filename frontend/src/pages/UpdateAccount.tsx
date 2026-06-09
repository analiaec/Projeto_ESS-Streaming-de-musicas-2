import React, { useState } from 'react';
import { useNavigate }     from 'react-router-dom';
import { updateUserApi }   from '../api';
import { useAuth }         from '../contexts/AuthContext';
import { useToast }        from '../contexts/ToastContext';
import { Navbar }          from '../components/Navbar';

export function UpdateAccount() {
  const { login, token, logado } = useAuth();
  const { toast }   = useToast();
  const navigate    = useNavigate();

  const [name,        setName]        = useState('');
  const [password,    setPassword]    = useState('');
  const [tipodeconta, setTipodeconta] = useState('');
  const [saving,      setSaving]      = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!logado || !login || !token) { navigate('/login'); return; }
    if (!name.trim() && !password.trim() && !tipodeconta) {
      toast('Preencha pelo menos um campo para atualizar.', 'error');
      return;
    }

    const dados: any = {};
    if (name.trim())     dados.name        = name.trim();
    if (password.trim()) dados.password    = password.trim();
    if (tipodeconta)     dados.tipodeconta = tipodeconta;

    setSaving(true);
    try {
      await updateUserApi(login, dados, token);
      toast('Dados atualizados com sucesso!', 'success');
      navigate('/conta');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao atualizar.';
      toast(Array.isArray(msg) ? msg[0] : msg, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>✏️ Editar Dados</h1>

          <div className="card" style={{ maxWidth: 440 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Novo nome</label>
                <input
                  placeholder="Deixe em branco para não alterar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nova senha</label>
                <input
                  type="password"
                  placeholder="Deixe em branco para não alterar"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Tipo de conta</label>
                <select value={tipodeconta} onChange={e => setTipodeconta(e.target.value)}>
                  <option value="">Não alterar</option>
                  <option value="OUVINTE">OUVINTE</option>
                  <option value="ARTISTA">ARTISTA</option>
                  <option value="PODCASTER">PODCASTER</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Salvando…' : 'Salvar'}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/conta')}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
