import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function ModalOverlay({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md' 
}: ModalOverlayProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className={`
        relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-calm border border-soft-blue-200/50
        ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden
        animate-fade-in transform transition-all duration-300 ease-out
      `}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-soft-blue-200/50">
            <h2 
              id="modal-title"
              className="text-2xl font-light bg-gradient-to-r from-soft-blue-600 to-muted-teal-600 bg-clip-text text-transparent"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-therapy-gray-100 hover:bg-therapy-gray-200 text-therapy-gray-600 hover:text-therapy-gray-800 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-therapy-gray-300"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
}