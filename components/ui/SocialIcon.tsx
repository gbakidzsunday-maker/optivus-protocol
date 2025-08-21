
import React from 'react';

export const SocialIcon: React.FC<{href: string, 'aria-label': string, children: React.ReactNode}> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-brand-light-gray/80 hover:text-brand-white transition-colors">
        {children}
    </a>
);