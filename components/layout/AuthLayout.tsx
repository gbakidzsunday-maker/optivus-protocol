
import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatedWaveBackground } from '../ui/AnimatedWaveBackground';
import { Logo } from '../ui/Logo';
import { SocialIcon } from '../ui/SocialIcon';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    showSocials?: boolean;
    footerText?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, showSocials = true, footerText }) => {
    return (
        <div className="min-h-screen bg-brand-dark text-brand-white flex flex-col p-4 relative overflow-hidden">
            <AnimatedWaveBackground />

            <header className="relative z-20 w-full max-w-6xl mx-auto">
                <Link to="/" className="text-brand-light-gray/80 hover:text-brand-white transition-colors flex items-center gap-1.5 text-sm group mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span>Back to Home</span>
                </Link>
                <Logo />
            </header>

            <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center flex-grow justify-center py-12">
                <h1 className="text-5xl md:text-6xl font-extrabold">{title}</h1>
                <p className="mt-2 text-lg text-brand-light-gray/80 max-w-2xl">
                    {subtitle}
                </p>
                <div className="w-full max-w-lg mt-4 border-t border-white/20"></div>

                <div className="mt-12 w-full">
                    {children}
                </div>
            </main>

            <footer className="relative z-10 text-center">
                {showSocials ? (
                    <>
                        <p className="text-lg font-semibold text-brand-light-gray/90">Follow us on</p>
                        <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
                            <SocialIcon href="https://x.com/OptivusProtocol?t=t15w-GFwUR-Dyo4JVoChuQ&s=09" aria-label="Follow on X">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </SocialIcon>
                            <SocialIcon href="https://www.youtube.com/@OptivusProtocol" aria-label="Watch on YouTube">
                                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.502-9.407-.502-9.407-.502s-7.537 0-9.407.502a3.007 3.007 0 0 0-2.088 2.088C.002 8.073 0 12 0 12s.002 3.927.505 5.795a3.007 3.007 0 0 0 2.088 2.088c1.87.502 9.407.502 9.407.502s7.537 0 9.407-.502a3.007 3.007 0 0 0 2.088-2.088C23.998 15.927 24 12 24 12s-.002-3.927-.505-5.795zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </SocialIcon>
                        </div>
                    </>
                ) : (
                    <p className="text-xs text-brand-light-gray/50">{footerText}</p>
                )}
            </footer>
        </div>
    );
};