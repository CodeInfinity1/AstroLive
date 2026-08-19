import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface ToastState {
  message: string;
  visible: boolean;
}

type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast>(() => {});

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false });

  useEffect(() => {
    if (!toast.visible) return;
    const t = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2800);
    return () => clearTimeout(t);
  }, [toast.visible, toast.message]);

  const show = useCallback((message: string) => {
    setToast({ message, visible: true });
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast.visible && (
        <div style={{
          position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--surface-elevated, #2a2520)', color: 'var(--text-primary, #f5e6d3)',
          padding: '10px 20px', borderRadius: 12, fontSize: '0.85rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)', zIndex: 9999,
          maxWidth: 'calc(100vw - 40px)', textAlign: 'center',
          border: '1px solid var(--accent, #c49a6c)',
          animation: 'toastIn 0.2s ease-out',
        }}>
          {toast.message}
        </div>
      )}
      <style>{`@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>
    </ToastContext.Provider>
  );
}
