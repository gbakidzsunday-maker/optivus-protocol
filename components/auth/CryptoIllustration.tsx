
import React from 'react';

export const CryptoIllustration: React.FC = () => {
    return (
        <div className="hidden md:flex items-center justify-center">
            <img 
                src="/phone.png" 
                alt="A smartphone displaying a crypto application interface, floating transparently over an abstract wave background." 
                className="h-auto max-w-4xl lg:max-w-5xl animate-float mix-blend-mode-screen opacity-90 drop-shadow-2xl"
            />
        </div>
    );
};

