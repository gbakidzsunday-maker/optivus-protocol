
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', ...props }) => {
  const errorId = id ? `${id}-error` : undefined;
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-brand-light-gray mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full bg-transparent border border-brand-ui-element rounded-md px-3 py-2 text-brand-white placeholder-brand-light-gray/50 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-300 ${error ? 'border-error' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && <p id={errorId} className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};