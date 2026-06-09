import { useState }       from 'react';
import { useNavigate }    from 'react-router-dom';
import { removeUserApi }  from '../api';
import { useAuth }        from '../contexts/AuthContext';
import { useToast }       from '../contexts/ToastContext';
import { Navbar }         from '../components/Navbar';

export function RemoveAccount() {
  const { login, token, logado, sair } = useAuth();
  const { toast }  = useToast();
  const navigate   = useNavigate();

  const [password, setPassword] = useState('');
  const [removing, setRemoving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!logado || !login || !token) { navigate('/login'); return; }
    if (!password.trim()) { toast('Informe sua senha para confirmar.', 'error'); return; }

    setRemoving(true);
    try {
      await removeUserApi(login, password, token);
      sair();
      navigate('/');
      toast('Conta excluída. Até logo!', 'info');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Erro ao excluir conta.';
      toast(Array.isArray(msg) ? msg[0] : msg, 'error');
    } finally {
      setRemoving(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>🗑 Excluir Conta</h1>

          <div className="card" style={{ maxWidth: 440 }}>
            <p style={{ color: 'var(--text-sub)', marginBottom: '1rem' }}>
              Esta ação é <strong style={{ color: 'var(--red, #f87171)' }}>permanente</strong> e não pode ser desfeita.
              Confirme sua senha para continuar.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Senha atual</label>
                <input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="submit" className="btn btn-danger btn-sm" disabled={removing}>
                  {removing ? 'Excluindo…' : 'Excluir minha conta'}
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
