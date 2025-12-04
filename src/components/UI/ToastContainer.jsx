import React from 'react';
import { Toast } from './Toast';

export const ToastContainer = ({ toasts, onRemoveToast, position = 'top-right' }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed z-50 pointer-events-none">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id}
          className="pointer-events-auto"
          style={{
            transform: `translateY(${index * 80}px)`,
            transition: 'transform 0.3s ease'
          }}
        >
          <Toast
            isOpen={toast.isOpen}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            position={position}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};