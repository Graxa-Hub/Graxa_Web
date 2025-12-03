import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning', // warning, error, success, info
  loading = false
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-500" />;
      case 'warning':
      default:
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'warning':
      default:
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center">
          {/* Ícone */}
          <div className="mx-auto mb-4">
            {getIcon()}
          </div>
          
          {/* Título */}
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          {/* Mensagem */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {message}
          </p>
          
          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              {cancelText}
            </button>
            
            <button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 px-4 py-3 rounded-xl transition-colors font-medium disabled:opacity-50 ${getConfirmButtonColor()}`}
            >
              {loading ? 'Processando...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};