
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Logo } from '../ui/Logo';

const SocialIcon: React.FC<{href: string, 'aria-label': string, children: React.ReactNode}> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className="text-brand-light-gray/80 hover:text-brand-white transition-colors">
        {children}
    </a>
)

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-brand-dark mt-16 border-t border-brand-ui-element/20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <div className="flex flex-wrap justify-center mt-6 -mx-4">
            <Link to="/about" className="mx-4 text-sm text-brand-light-gray hover:text-brand-white">{t('footer.about')}</Link>
            <Link to="/faq" className="mx-4 text-sm text-brand-light-gray hover:text-brand-white">{t('footer.faq')}</Link>
            <Link to="/contact" className="mx-4 text-sm text-brand-light-gray hover:text-brand-white">{t('footer.contact')}</Link>
            <Link to="/terms" className="mx-4 text-sm text-brand-light-gray hover:text-brand-white">{t('footer.terms')}</Link>
            <Link to="/privacy" className="mx-4 text-sm text-brand-light-gray hover:text-brand-white">{t('footer.privacy')}</Link>
          </div>
           <div className="mt-6">
                <p className="text-lg font-semibold text-brand-light-gray/90">{t('footer.follow_us')}</p>
                <div className="flex flex-wrap justify-center items-center gap-6 mt-4">
                    <SocialIcon href="https://x.com/OptivusProtocol?t=t15w-GFwUR-Dyo4JVoChuQ&s=09" aria-label="Follow on X">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </SocialIcon>
                    <SocialIcon href="https://www.youtube.com/@OptivusProtocol" aria-label="Watch on YouTube">
                         <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.502-9.407-.502-9.407-.502s-7.537 0-9.407.502a3.007 3.007 0 0 0-2.088 2.088C.002 8.073 0 12 0 12s.002 3.927.505 5.795a3.007 3.007 0 0 0 2.088 2.088c1.87.502 9.407.502 9.407.502s7.537 0 9.407-.502a3.007 3.007 0 0 0 2.088-2.088C23.998 15.927 24 12 24 12s-.002-3.927-.505-5.795zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </SocialIcon>
                </div>
            </div>
        </div>
        <hr className="my-6 border-brand-ui-element" />
        <div className="text-center text-brand-light-gray flex justify-center items-center space-x-2">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <span className="text-brand-ui-element">|</span>
          <div className="flex items-center gap-2">
            <img src="https://i.imgur.com/W8dUB8H.png" alt="Solana" className="h-4 w-4 rounded-full object-cover" />
            <span>Solana</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
