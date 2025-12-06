import React from 'react';
import { Toast } from './Toast';

export const ToastContainer = ({ toasts, onRemoveToast, position = 'top-right' }) => {
  if (!toasts || toasts.length === 0) return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-5 left-5';
      case 'top-center':
        return 'top-5 left-1/2 -translate-x-1/2';
      case 'top-right':
        return 'top-5 right-5';
      case 'bottom-left':
        return 'bottom-5 left-5';
      case 'bottom-center':
        return 'bottom-5 left-1/2 -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-5 right-5';
      default:
        return 'top-5 right-5';
    }
  };

  return (
    <div className={`fixed z-[9999] pointer-events-none ${getPositionClasses()}`}>
      <div className="space-y-2">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="pointer-events-auto"
          >
            <Toast
              isOpen={toast.isOpen}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={() => onRemoveToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};