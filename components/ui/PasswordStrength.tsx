
import React from 'react';

interface PasswordStrengthProps {
  password?: string;
}

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) return { score: 0, label: '' };
  if (password.length < 8) return { score: 1, label: 'Too short' };
  
  let variations = 0;
  if (/[A-Z]/.test(password)) variations++; // Uppercase
  if (/[a-z]/.test(password)) variations++; // Lowercase
  if (/[0-9]/.test(password)) variations++; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) variations++; // Symbols

  score = variations;
  if (password.length > 12) score++;

  if (score > 3) return { score: 3, label: 'Strong' };
  if (score > 2) return { score: 2, label: 'Medium' };
  return { score: 1, label: 'Weak' };
};

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  const { score, label } = getPasswordStrength(password);
  
  if (!password) return null;

  const strengthColors = [
    'bg-brand-ui-element', // 0 - initial
    'bg-error',    // 1 - Weak
    'bg-warning',  // 2 - Medium
    'bg-success',  // 3 - Strong
  ];
  
  const scoreToWidth: { [key: number]: string } = {
      0: '0%',
      1: '33%',
      2: '66%',
      3: '100%',
  }

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="w-full bg-brand-ui-element/30 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strengthColors[score]}`}
          style={{ width: scoreToWidth[score] }}
        />
      </div>
      <span className={`text-xs font-semibold w-20 text-right ${
        score === 3 ? 'text-success' : score === 2 ? 'text-warning' : score === 1 ? 'text-error' : 'text-brand-light-gray'
      }`}>
        {label}
      </span>
    </div>
  );
};
