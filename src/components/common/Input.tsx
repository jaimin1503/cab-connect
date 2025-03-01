import React from 'react';

interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  name,
  id,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
}) => {
  const inputId = id || name || Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full px-4 py-2 rounded-md border 
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
            ${icon ? 'pl-10' : ''}
            bg-white dark:bg-gray-700 
            text-gray-900 dark:text-white 
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
            focus:border-transparent
            disabled:bg-gray-100 dark:disabled:bg-gray-800 
            disabled:text-gray-500 dark:disabled:text-gray-400
            disabled:cursor-not-allowed
            transition-colors duration-200
          `}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;