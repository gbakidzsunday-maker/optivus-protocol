import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <Link to="/" className={`flex items-center gap-3 ${className}`}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 flex-shrink-0 text-brand-white">
        <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="91.67 8.33"
            transform="rotate(135 20 20)"
        />
        <circle cx="20" cy="20" r="6" fill="currentColor" />
    </svg>
    <div className="flex flex-col">
        <span className="font-extrabold text-sm tracking-wider leading-tight text-brand-white">OPTIVUS</span>
        <span className="font-extrabold text-sm tracking-wider leading-tight text-brand-white">PROTOCOL</span>
    </div>
  </Link>
);
