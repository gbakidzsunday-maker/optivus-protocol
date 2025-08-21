
import React, { useState } from 'react';
import { Input } from './Input';
import { PasswordStrength } from './PasswordStrength';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  showStrength?: boolean;
  containerClassName?: string;
}

const PasswordToggleIcon: React.FC<{visible: boolean}> = ({ visible }) => (
    <>
    {visible ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3.93 3.93l16.14 16.14" /></svg>
    )}
    </>
);

export const PasswordInput: React.FC<PasswordInputProps> = ({ error, showStrength, containerClassName, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={containerClassName}>
            <div className="relative">
                <Input
                    type={showPassword ? 'text' : 'password'}
                    error={error}
                    {...props}
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    aria-label={showPassword ? "Hide password" : "Show password"} 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-light-gray/60 hover:text-brand-light-gray"
                >
                    <PasswordToggleIcon visible={showPassword} />
                </button>
            </div>
            {showStrength && <PasswordStrength password={props.value as string} />}
        </div>
    );
};