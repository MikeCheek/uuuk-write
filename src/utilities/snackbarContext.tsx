import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

const SnackbarContext = createContext({ showSnackbar: (message: string, type: 'success' | 'error' | 'info') => { }, removeSnackbar: (id: string) => { } });

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: string }>>([]);

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 3000);
  }, []);

  const removeSnackbar = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar, removeSnackbar }}>
      {children}

      {/* Container for floating alerts */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 w-full max-w-[80vw] pointer-events-none "
        style={{ zIndex: 9999 }}>
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-center justify-between p-3 rounded-md shadow-lg border animate-in slide-in-from-right-5 duration-300 pointer-events-auto`}
            style={{
              backgroundColor: alert.type === 'success' ? '#d4edda' : alert.type === 'error' ? '#f8d7da' : '#cce5ff',
              color: alert.type === 'success' ? '#155724' : alert.type === 'error' ? '#721c24' : '#004085',
            }}
          >
            <div className="flex items-center gap-2">
              {alert.type === 'success' && <CheckCircle size={16} className="text-green-600" />}
              {alert.type === 'error' && <AlertCircle size={16} className="text-red-600" />}
              <span className="text-sm">{alert.message}</span>
            </div>
            <button
              onClick={() => removeSnackbar(alert.id)}
              className="ml-3 text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);