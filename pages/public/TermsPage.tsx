
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../../components/layout/PageWrapper';

type TermsSection = {
    title: string;
    content: string[];
};

export const TermsPage: React.FC = () => {
    const { t } = useTranslation();
    const sections = t('termsPage.sections', { returnObjects: true });

    return (
        <PageWrapper title={t('termsPage.title')}>
            <div className="text-right text-brand-light-gray/80 mb-6 -mt-4">
                <p>{t('termsPage.lastUpdated')}</p>
            </div>

            <p className="mb-6">{t('termsPage.intro')}</p>

            {Array.isArray(sections) && (sections as TermsSection[]).map((section, index) => (
                <section key={index}>
                    <h2>{section.title}</h2>
                    {section.content.map((paragraph, pIndex) => {
                        if (paragraph.startsWith('<strong>')) {
                            return <p key={pIndex} className="p-4 bg-brand-panel/50 border-l-4 border-warning my-4" dangerouslySetInnerHTML={{ __html: paragraph }} />;
                        }
                        if (paragraph.startsWith('<i>')) {
                            return <p key={pIndex} className="italic" dangerouslySetInnerHTML={{ __html: paragraph }} />;
                        }
                        if (section.title.includes("Benefits") || section.title.includes("Rules") || section.title.includes("Notice") || section.title.includes("Giveaways") || section.title.includes("Authority") || section.title.includes("Acknowledgment")) {
                           if (pIndex > 0) {
                             return <li key={pIndex} className="my-2">{paragraph}</li>;
                           }
                           return <p key={pIndex}>{paragraph}</p>;
                        }
                        return <p key={pIndex}>{paragraph}</p>;
                    })}
                </section>
            ))}
            
             <section>
                <h2>{t('termsPage.contact.title')}</h2>
                <p>{t('termsPage.contact.p1')} <a href="mailto:contact@optivusprotocol.io" className="text-brand-secondary hover:underline">contact@optivusprotocol.io</a></p>
                <p>{t('termsPage.contact.p2')}</p>
            </section>
        </PageWrapper>
    );
};