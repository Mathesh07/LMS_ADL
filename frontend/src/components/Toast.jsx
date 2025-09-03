import { useEffect } from 'react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const toastClasses = {
    success: 'bg-green-500 border-l-green-600',
    error: 'bg-red-500 border-l-red-600',
    warning: 'bg-yellow-500 border-l-yellow-600',
    info: 'bg-blue-500 border-l-blue-600'
  };

  const iconClasses = {
    success: 'text-green-100',
    error: 'text-red-100',
    warning: 'text-yellow-100',
    info: 'text-blue-100'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${toastClasses[type]} text-white px-6 py-4 rounded-lg shadow-lg border-l-4 flex items-center justify-between transform transition-all duration-300 ease-in-out`}>
        <div className="flex items-center">
          <span className={`text-xl mr-3 ${iconClasses[type]}`}>
            {icons[type]}
          </span>
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none transition-colors duration-200"
        >
          <span className="text-xl">×</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
