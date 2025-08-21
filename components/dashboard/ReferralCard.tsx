
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

const SocialShareIcon: React.FC<{ href: string; 'aria-label': string; children: React.ReactNode }> = ({ href, 'aria-label': ariaLabel, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className="text-brand-light-gray hover:text-brand-secondary transition-colors duration-200"
    >
        {children}
    </a>
);

export const ReferralCard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'link' | 'code'>('link');
    const [copied, setCopied] = useState(false);

    if (!user?.referral_code) return null;

    const referralCode = user.referral_code;
    const referralLink = `${window.location.origin}${window.location.pathname}#/?ref=${referralCode}`;
    
    const contentToCopy = activeTab === 'link' ? referralLink : referralCode;
    const shareText = t('dashboard.referralCard.shareText');

    const handleCopy = () => {
        navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    
    return (
        <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">{t('dashboard.referralCard.title')}</h2>
            <div className="flex border-b border-brand-ui-element/30 mb-4">
                <button 
                    className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'link' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-brand-light-gray hover:text-white'}`}
                    onClick={() => setActiveTab('link')}
                    aria-current={activeTab === 'link'}
                >
                    {t('dashboard.referralCard.linkTab')}
                </button>
                <button 
                    className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'code' ? 'text-brand-secondary border-b-2 border-brand-secondary' : 'text-brand-light-gray hover:text-white'}`}
                    onClick={() => setActiveTab('code')}
                     aria-current={activeTab === 'code'}
                >
                    {t('dashboard.referralCard.codeTab')}
                </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-brand-dark/50 p-3 rounded-md">
                <input
                    type="text"
                    readOnly
                    value={contentToCopy}
                    className="w-full bg-transparent text-brand-secondary font-mono text-sm p-2 rounded-md focus:outline-none truncate"
                    aria-label="Referral data"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button onClick={handleCopy} variant="secondary" size="sm" className="flex-shrink-0">
                    {copied ? t('common.copied') : t('common.copy')}
                </Button>
            </div>
            
            <div className="mt-6">
                <p className="text-sm text-brand-light-gray mb-3 text-center sm:text-left">{t('dashboard.referralCard.shareAria')}</p>
                <div className="flex justify-center sm:justify-start items-center space-x-5">
                    <SocialShareIcon href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`} aria-label={t('dashboard.referralCard.socials.x')}>
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </SocialShareIcon>
                    <SocialShareIcon href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`} aria-label={t('dashboard.referralCard.socials.facebook')}>
                         <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.19795 21.5H13.198V13.4901H16.1618L16.6711 9.49012H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H16.5V2.5H13.198C10.4365 2.5 8.25 4.6865 8.25 7.5V9.49012H5.5V13.4901H8.25V21.5H9.19795Z" /></svg>
                    </SocialShareIcon>
                    <SocialShareIcon href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`} aria-label={t('dashboard.referralCard.socials.whatsapp')}>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zM17.1 15.28c-.28-.14-1.67-.82-1.92-.91s-.44-.14-.62.14c-.19.28-.72.91-.89 1.1s-.33.22-.62.07c-.28-.14-1.22-.45-2.32-1.43s-1.79-2.1-2.09-2.46c-.3-.36-.04-.55.13-.7s.28-.33.42-.49.19-.28.28-.47.05-.33-.02-.47c-.07-.14-.62-1.5-.85-2.04s-.45-.44-.62-.44h-.5c-.19 0-.47.07-.72.33s-.98.96-.98 2.33.98 2.71 1.13 2.89c.14.19 1.98 3.16 4.81 4.22.68.25 1.21.4 1.64.51.72.19 1.39.12 1.9-.07.57-.22 1.67-1.14 1.9-1.55.24-.4.24-.75.17-.89l-.29-.14z"/></svg>
                    </SocialShareIcon>
                    <SocialShareIcon href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`} aria-label={t('dashboard.referralCard.socials.telegram')}>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.62 12.1c-.8-.25-.8-1 .2-1.22l16.4-6.35c.69-.27 1.22.17 1.02.94l-3.48 16.5c-.23.89-.84 1.11-1.48.69l-4.93-3.63-2.32 2.23c-.25.24-.46.45-.83.45z"/></svg>
                    </SocialShareIcon>
                     <SocialShareIcon href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`} aria-label={t('dashboard.referralCard.socials.linkedin')}>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.5 1.5 4s1-2.5 2.5-2.5c1.5 0 2.5 1 2.5 2.5S5.5 6.5 4 6.5zM21.5 21.5h-5v-6.5c0-1.5-.5-2.5-2-2.5s-2 .5-2 2.5v6.5h-5v-13h5V10c1-1.5 2.5-3 4.5-3s5 2 5 6v8.5z" /></svg>
                    </SocialShareIcon>
                </div>
            </div>
        </div>
    );
};
