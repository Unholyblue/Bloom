import React from 'react';
import { AlertTriangle, Info, X, Trash2 } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'info'
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: Trash2,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          titleColor: 'text-red-900'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          confirmBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
          titleColor: 'text-amber-900'
        };
      default:
        return {
          icon: Info,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          titleColor: 'text-blue-900'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-calm border border-soft-blue-200/50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-soft-blue-200/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${styles.iconBg} rounded-xl flex items-center justify-center`}>
              <IconComponent size={20} className={styles.iconColor} />
            </div>
            <h2 
              id="dialog-title"
              className={`text-xl font-semibold ${styles.titleColor}`}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600 hover:text-therapy-gray-800 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-therapy-gray-300"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p 
            id="dialog-description"
            className="text-therapy-gray-700 leading-relaxed mb-6"
          >
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-700 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-therapy-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-3 ${styles.confirmBg} text-white font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 ${styles.confirmBg.includes('focus:ring-') ? '' : 'focus:ring-blue-500'}`}
              autoFocus
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}