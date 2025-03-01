import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  onClose?: () => void;
  className?: string;
  isVisible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type,
  message,
  description,
  onClose,
  className = '',
  isVisible = true,
}) => {
  const typeConfig = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-800 dark:text-green-200',
      borderColor: 'border-green-400 dark:border-green-700',
      iconColor: 'text-green-500 dark:text-green-400',
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-800 dark:text-red-200',
      borderColor: 'border-red-400 dark:border-red-700',
      iconColor: 'text-red-500 dark:text-red-400',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5" />,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-800 dark:text-yellow-200',
      borderColor: 'border-yellow-400 dark:border-yellow-700',
      iconColor: 'text-yellow-500 dark:text-yellow-400',
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-800 dark:text-blue-200',
      borderColor: 'border-blue-400 dark:border-blue-700',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
  };

  const config = typeConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`rounded-md border ${config.borderColor} ${config.bgColor} p-4 ${className}`}
          role="alert"
        >
          <div className="flex">
            <div className={`flex-shrink-0 ${config.iconColor}`}>
              {config.icon}
            </div>
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${config.textColor}`}>
                {message}
              </h3>
              {description && (
                <div className={`mt-2 text-sm ${config.textColor} opacity-90`}>
                  {description}
                </div>
              )}
            </div>
            {onClose && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:bg-opacity-20 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.borderColor}`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;