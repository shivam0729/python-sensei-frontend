import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const duration = 4000;

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const showSuccess = useCallback((message) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message) => {
    showToast(message, "error");
  }, [showToast]);

  const showWarning = useCallback((message) => {
    showToast(message, "warning");
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning }}>
      {children}
      
      {/* Toast container overlay */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-card toast-${toast.type} animate-slide-in`}>
            <div className="toast-icon">
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✗"}
              {toast.type === "warning" && "⚠"}
            </div>
            <div className="toast-message">{toast.message}</div>
            <button className="toast-close-btn" onClick={() => removeToast(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
