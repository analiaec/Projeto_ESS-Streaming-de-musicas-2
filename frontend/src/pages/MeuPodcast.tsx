import { useEffect, useState }        from 'react';
import { useNavigate }               from 'react-router-dom';
import {
  getAllEpisodesApi,
  getTotalAcessosApi,
  createEpisodeApi,
  updateEpisodeApi,
  deleteEpisodeApi,
} from '../api';
import { Episode }                   from '../types';
import { useAuth }                   from '../contexts/AuthContext';
import { useToast }                  from '../contexts/ToastContext';
import { Navbar }                    from '../components/Navbar';
import './MeuPodcast.css';

interface EpForm { titulo: string; arquivoUrl: string; dataPublicacaoAgendada: string; }
const FORM0: EpForm = { titulo: '', arquivoUrl: '', dataPublicacaoAgendada: '' };

export function MeuPodcast() {
  const { login, role, token }         = useAuth();
  const { toast }                      = useToast();
  const navigate                       = useNavigate();

  const [episodios,   setEpisodios]    = useState<Episode[]>([]);
  const [total,       setTotal]        = useState(0);
  const [carregando,  setCarregando]   = useState(true);
  const [form,        setForm]         = useState<EpForm>(FORM0);
  const [salvando,    setSalvando]     = useState(false);
  const [erroForm,    setErroForm]     = useState('');
  const [editandoId,  setEditandoId]   = useState<number | null>(null);
  const [editForm,    setEditForm]     = useState<Partial<EpForm>>({});

  useEffect(() => {
    if (role !== 'PODCASTER') { navigate('/'); return; }
    if (!login) return;
    carregar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, role]);

  async function carregar() {
    if (!login) return;
    setCarregando(true);
    try {
      const [eps, acc] = await Promise.all([
        getAllEpisodesApi(login),
        getTotalAcessosApi(login),
      ]);
      setEpisodios(eps);
      setTotal(acc.totalAcessos ?? 0);
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriar() {
    if (!form.titulo.trim()) { setErroForm('O título é obrigatório.'); return; }
    setSalvando(true);
    setErroForm('');
    try {
      const dto: any = { titulo: form.titulo };
      if (form.arquivoUrl.trim())             dto.arquivoUrl = form.arquivoUrl.trim();
      if (form.dataPublicacaoAgendada.trim()) dto.dataPublicacaoAgendada = new Date(form.dataPublicacaoAgendada).toISOString();
      await createEpisodeApi(login!, dto, token!);
      setForm(FORM0);
      await carregar();
      toast('Episódio criado com sucesso!', 'success');
    } catch (e: any) {
      const msg = e.response?.data?.message || 'Erro ao criar episódio.';
      setErroForm(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setSalvando(false);
    }
  }

  function iniciarEdicao(ep: Episode) {
    setEditandoId(ep.id);
    setEditForm({
      titulo: ep.titulo,
      arquivoUrl: ep.arquivoUrl ?? '',
      dataPublicacaoAgendada: ep.dataPublicacaoAgendada
        ? new Date(ep.dataPublicacaoAgendada).toISOString().slice(0, 16)
        : '',
    });
  }

  async function salvarEdicao(epId: number) {
    if (!editForm.titulo?.trim()) return;
    setSalvando(true);
    try {
      const dto: any = { titulo: editForm.titulo };
      if (editForm.arquivoUrl !== undefined)             dto.arquivoUrl = editForm.arquivoUrl || null;
      if (editForm.dataPublicacaoAgendada !== undefined) {
        dto.dataPublicacaoAgendada = editForm.dataPublicacaoAgendada
          ? new Date(editForm.dataPublicacaoAgendada).toISOString()
          : null;
      }
      await updateEpisodeApi(login!, epId, dto, token!);
      setEditandoId(null);
      await carregar();
      toast('Episódio atualizado.', 'success');
    } catch (e: any) {
      toast(e.response?.data?.message || 'Erro ao salvar.', 'error');
    } finally {
      setSalvando(false);
    }
  }

  async function handleDeletar(epId: number) {
    if (!window.confirm('Deletar este episódio?')) return;
    try {
      await deleteEpisodeApi(login!, epId, token!);
      await carregar();
      toast('Episódio deletado.', 'info');
    } catch (e: any) {
      toast(e.response?.data?.message || 'Erro ao deletar.', 'error');
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>🎙 Meu Podcast</h1>

          {carregando && <div className="loader-wrap"><span className="loader" /></div>}

          {!carregando && (
            <>
              <div className="mp-stats">
                <div className="mp-stat card">
                  <span className="mp-stat-num">{total}</span>
                  <span className="mp-stat-label">reproduções totais</span>
                </div>
                <div className="mp-stat card">
                  <span className="mp-stat-num">{episodios.length}</span>
                  <span className="mp-stat-label">episódios</span>
                </div>
              </div>

              <div className="card mp-form-card">
                <h2 className="mp-form-title">Novo Episódio</h2>
                <div className="mp-form">
                  <div className="form-group">
                    <label className="form-label">Título *</label>
                    <input placeholder="Título do episódio" value={form.titulo}
                      onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">URL do arquivo</label>
                    <input placeholder="https://… (mp3, wav, m4a)" value={form.arquivoUrl}
                      onChange={e => setForm(f => ({ ...f, arquivoUrl: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publicar em (deixe em branco para publicar agora)</label>
                    <input type="datetime-local" value={form.dataPublicacaoAgendada}
                      onChange={e => setForm(f => ({ ...f, dataPublicacaoAgendada: e.target.value }))} />
                  </div>
                  {erroForm && <div className="alert alert-error">{erroForm}</div>}
                  <button className="btn btn-primary btn-sm" onClick={handleCriar} disabled={salvando}>
                    {salvando ? 'Salvando…' : 'Criar Episódio'}
                  </button>
                </div>
              </div>

              <div className="divider" />

              <h2 className="section-title" style={{ marginBottom: '0.85rem' }}>
                Episódios
                <span className="badge" style={{ marginLeft: '0.5rem', verticalAlign: 'middle' }}>
                  {episodios.length}
                </span>
              </h2>

              {episodios.length === 0 ? (
                <div className="empty-state">Nenhum episódio ainda. Crie o primeiro!</div>
              ) : (
                <ul className="mp-ep-list">
                  {episodios.map(ep => (
                    <li key={ep.id} className="card mp-ep">
                      {editandoId === ep.id ? (
                        <div className="mp-edit-form">
                          <div className="form-group">
                            <label className="form-label">Título</label>
                            <input value={editForm.titulo ?? ''}
                              onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">URL do arquivo</label>
                            <input value={editForm.arquivoUrl ?? ''}
                              onChange={e => setEditForm(f => ({ ...f, arquivoUrl: e.target.value }))} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Data de publicação agendada</label>
                            <input type="datetime-local" value={editForm.dataPublicacaoAgendada ?? ''}
                              onChange={e => setEditForm(f => ({ ...f, dataPublicacaoAgendada: e.target.value }))} />
                          </div>
                          <div className="mp-edit-actions">
                            <button className="btn btn-primary btn-sm"
                              onClick={() => salvarEdicao(ep.id)} disabled={salvando}>
                              {salvando ? 'Salvando…' : 'Salvar'}
                            </button>
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => setEditandoId(null)}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mp-ep-row">
                          <div className="mp-ep-info">
                            <span className="mp-ep-titulo">{ep.titulo}</span>
                            <div className="mp-ep-meta">
                              <span className="badge">{ep.reproducoes} rep.</span>
                              {ep.publicado && (
                                <span className="badge mp-badge-live">Publicado</span>
                              )}
                              {!ep.publicado && ep.dataPublicacaoAgendada && (
                                <span className="badge mp-badge-sched">
                                  Agendado: {new Date(ep.dataPublicacaoAgendada).toLocaleString('pt-BR')}
                                </span>
                              )}
                              {!ep.publicado && !ep.dataPublicacaoAgendada && (
                                <span className="badge mp-badge-draft">Rascunho</span>
                              )}
                            </div>
                          </div>
                          <div className="mp-ep-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => iniciarEdicao(ep)}>
                              Editar
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeletar(ep.id)}>
                              Deletar
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
