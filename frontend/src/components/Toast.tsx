import { useToast } from '../contexts/ToastContext';
import './Toast.css';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">
            {t.type === 'success' && '✓'}
            {t.type === 'error'   && '✕'}
            {t.type === 'info'    && 'i'}
          </span>
          <span className="toast-message">{t.message}</span>
          <button className="toast-close" onClick={() => dismiss(t.id)}>×</button>
        </div>
      ))}
    </div>
  );
}
