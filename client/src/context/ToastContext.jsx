import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container floating bottom-right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-elevated backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'error'
                ? 'bg-[#1B2035]/95 border-[#FF718B]/40 text-[#F5F6FF]'
                : toast.type === 'info'
                ? 'bg-[#1B2035]/95 border-[#8B5CF6]/40 text-[#F5F6FF]'
                : 'bg-[#1B2035]/95 border-[#42E8B4]/40 text-[#F5F6FF]'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-[#FF718B] shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-5 h-5 text-[#8B5CF6] shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-[#42E8B4] shrink-0" />
              )}
              <p className="text-sm font-medium leading-tight">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#9299B3] hover:text-[#F5F6FF] transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
