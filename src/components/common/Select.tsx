import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  id?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  name,
  id,
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder,
}) => {
  const selectId = id || name || Math.random().toString(36).substring(2, 9);
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-4 py-2 rounded-md border 
          ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} 
          bg-white dark:bg-gray-700 
          text-gray-900 dark:text-white 
          focus:outline-none focus:ring-2 
          ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} 
          focus:border-transparent
          disabled:bg-gray-100 dark:disabled:bg-gray-800 
          disabled:text-gray-500 dark:disabled:text-gray-400
          disabled:cursor-not-allowed
          transition-colors duration-200
          appearance-none
          bg-no-repeat bg-right
          bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%236B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>')]
          bg-[length:16px_16px]
          pr-10
        `}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Select;