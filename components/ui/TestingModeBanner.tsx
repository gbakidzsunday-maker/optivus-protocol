
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const TestingModeBanner: React.FC = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner only if it hasn't been dismissed in this session
        if (sessionStorage.getItem('testingBannerDismissed') !== 'true') {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        sessionStorage.setItem('testingBannerDismissed', 'true');
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-brand-panel backdrop-blur-lg border-2 border-warning rounded-lg shadow-2xl p-4 max-w-sm text-sm">
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-brand-light-gray hover:text-brand-white"
                aria-label="Dismiss"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="flex items-start gap-3">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold text-brand-white">{t('testingBanner.title')}</h4>
                    <p className="text-brand-light-gray mt-1">
                        {t('testingBanner.description')}
                    </p>
                    <div className="mt-3 bg-brand-dark/50 p-2 rounded-md space-y-2">
                         <div>
                             <p className="font-mono text-xs font-semibold text-brand-light-gray">{t('testingBanner.userLogin')}</p>
                             <p className="font-mono text-xs pl-2">
                                 <span className="font-semibold text-brand-light-gray/80">{t('testingBanner.email')}</span> alex.doe@example.com
                             </p>
                             <p className="font-mono text-xs pl-2">
                                <span className="font-semibold text-brand-light-gray/80">{t('testingBanner.pass')}</span> password123
                             </p>
                         </div>
                         <div className="border-t border-brand-ui-element/30"></div>
                         <div>
                             <p className="font-mono text-xs font-semibold text-brand-light-gray">{t('testingBanner.adminLogin')}</p>
                             <p className="font-mono text-xs pl-2">
                                 <span className="font-semibold text-brand-light-gray/80">{t('testingBanner.email')}</span> admin@optivus.com
                             </p>
                             <p className="font-mono text-xs pl-2">
                                <span className="font-semibold text-brand-light-gray/80">{t('testingBanner.pass')}</span> adminpassword
                             </p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
