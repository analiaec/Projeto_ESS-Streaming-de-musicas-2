import { useEffect, useState } from 'react';
import { Link, useParams }     from 'react-router-dom';
import {
  getPodcastApi,
  getEpisodesApi,
  getTotalAcessosApi,
  playEpisodeApi,
  downloadEpisodeApi,
} from '../api';
import { Podcast, Episode }    from '../types';
import { useAuth }             from '../contexts/AuthContext';
import { useToast }            from '../contexts/ToastContext';
import { Navbar }              from '../components/Navbar';
import './PodcastPerfil.css';

export function PodcastPerfil() {
  const { login: podcastLogin }            = useParams<{ login: string }>();
  const { login: userLogin, logado }       = useAuth();
  const { toast }                          = useToast();

  const [podcast,     setPodcast]          = useState<Podcast | null>(null);
  const [episodios,   setEpisodios]        = useState<Episode[]>([]);
  const [totalAcesso, setTotal]            = useState<number>(0);
  const [carregando,  setCarregando]       = useState(true);
  const [erro,        setErro]             = useState<string | null>(null);
  const [baixando,    setBaixando]         = useState<number | null>(null);
  const [playingId,   setPlayingId]        = useState<number | null>(null);

  useEffect(() => {
    if (!podcastLogin) return;
    Promise.all([
      getPodcastApi(podcastLogin),
      getEpisodesApi(podcastLogin),
      getTotalAcessosApi(podcastLogin),
    ])
      .then(([pod, eps, acessos]) => {
        setPodcast(pod);
        setEpisodios(eps);
        setTotal(acessos.totalAcessos ?? 0);
      })
      .catch(() => setErro('Podcast não encontrado.'))
      .finally(() => setCarregando(false));
  }, [podcastLogin]);

  async function handlePlay(ep: Episode) {
    // se já está tocando este episódio, para
    if (playingId === ep.id) {
      setPlayingId(null);
      return;
    }

    // sem URL: só incrementa contador
    if (!ep.arquivoUrl) {
      try {
        await playEpisodeApi(ep.id);
        setEpisodios(prev =>
          prev.map(e => e.id === ep.id ? { ...e, reproducoes: e.reproducoes + 1 } : e)
        );
        setTotal(prev => prev + 1);
      } catch {
        toast('Erro ao registrar reprodução.', 'error');
      }
      return;
    }

    // com URL: abre player e incrementa contador
    setPlayingId(ep.id);
    try {
      await playEpisodeApi(ep.id);
      setEpisodios(prev =>
        prev.map(e => e.id === ep.id ? { ...e, reproducoes: e.reproducoes + 1 } : e)
      );
      setTotal(prev => prev + 1);
    } catch {
      // contador falhou mas player abre mesmo assim
    }
  }

  async function handleDownload(episodeId: number) {
    if (!userLogin) {
      toast('Faça login para baixar episódios.', 'error');
      return;
    }
    setBaixando(episodeId);
    try {
      const res = await downloadEpisodeApi(episodeId, userLogin);
      window.open(res.arquivoUrl, '_blank');
    } catch (e: any) {
      toast(e.response?.data?.message || 'Erro ao fazer download.', 'error');
    } finally {
      setBaixando(null);
    }
  }

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="page-inner">
          {carregando && <div className="loader-wrap"><span className="loader" /></div>}
          {erro && <div className="alert alert-error">{erro}</div>}

          {!carregando && !erro && podcast && (
            <>
              <Link to="/podcasts" className="back-link">← Todos os podcasts</Link>

              <div className="perfil-hero">
                <div className="perfil-avatar">🎙</div>
                <div className="perfil-hero-info">
                  <h1 className="perfil-nome">{podcast.name}</h1>
                  <span className="perfil-handle">@{podcast.login}</span>
                  {podcast.descricao && (
                    <p className="perfil-desc">{podcast.descricao}</p>
                  )}
                </div>
                <div className="perfil-stat">
                  <span className="perfil-stat-num">{totalAcesso}</span>
                  <span className="perfil-stat-label">reproduções totais</span>
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
                <div className="empty-state">Nenhum episódio publicado ainda.</div>
              ) : (
                <ul className="ep-list">
                  {episodios.map(ep => (
                    <li key={ep.id} className={`ep-item card ${playingId === ep.id ? 'ep-playing' : ''}`}>
                      <div className="ep-main-row">
                        <div className="ep-info">
                          <span className="ep-titulo">{ep.titulo}</span>
                          <span className="ep-rep">{ep.reproducoes} rep.</span>
                        </div>
                        <div className="ep-actions">
                          <button
                            className={`btn btn-sm ep-play-btn ${playingId === ep.id ? 'ep-play-btn-active' : 'btn-ghost'}`}
                            onClick={() => handlePlay(ep)}
                          >
                            {playingId === ep.id ? '⏹ Parar' : '▶ Reproduzir'}
                          </button>
                          {logado && ep.arquivoUrl && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleDownload(ep.id)}
                              disabled={baixando === ep.id}
                            >
                              {baixando === ep.id ? 'Aguarde…' : '⬇ Download'}
                            </button>
                          )}
                          {!logado && ep.arquivoUrl && (
                            <Link to="/login" className="btn btn-ghost btn-sm">
                              Login p/ download
                            </Link>
                          )}
                        </div>
                      </div>

                      {playingId === ep.id && ep.arquivoUrl && (
                        <div className="ep-player">
                          <audio
                            key={ep.arquivoUrl}
                            controls
                            autoPlay
                            className="ep-audio"
                            onEnded={() => setPlayingId(null)}
                          >
                            <source src={ep.arquivoUrl} />
                            Seu browser não suporta o player de áudio.
                          </audio>
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
