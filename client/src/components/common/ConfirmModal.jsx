import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', isDanger = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="panel-card w-full max-w-md p-6 border border-[#262D4A] dark:border-[#262D4A] dark:bg-[#1B2035] bg-white rounded-2xl shadow-elevated">
        <div className="flex items-center justify-between pb-4 border-b border-[#262D4A]/50 dark:border-[#262D4A]/50 border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDanger ? 'bg-[#FF718B]/15 text-[#FF718B]' : 'bg-[#8B5CF6]/15 text-[#8B5CF6]'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#F5F6FF] dark:text-[#F5F6FF] text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#9299B3] hover:text-[#F5F6FF] dark:hover:text-[#F5F6FF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="py-5 text-sm text-[#9299B3] dark:text-[#9299B3] text-gray-600 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#9299B3] hover:text-[#F5F6FF] dark:text-[#9299B3] dark:hover:text-[#F5F6FF] hover:bg-[#262D4A]/30 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 text-sm font-semibold rounded-xl text-white transition-all shadow-md ${
              isDanger
                ? 'bg-[#FF718B] hover:bg-[#ff5272] shadow-[#FF718B]/20'
                : 'bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-[#8B5CF6]/20'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
