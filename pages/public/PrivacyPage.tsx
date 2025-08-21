
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../../components/layout/PageWrapper';

type PrivacySection = {
    title: string;
    content: string[];
};

export const PrivacyPage: React.FC = () => {
    const { t } = useTranslation();
    const sections = t('privacyPage.sections', { returnObjects: true });
  return (
    <PageWrapper title={t('privacyPage.title')}>
      {Array.isArray(sections) && (sections as PrivacySection[]).map((section, index) => (
        <section key={index}>
            <h2>{section.title}</h2>
            {section.content.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
            ))}
        </section>
      ))}
    </PageWrapper>
  );
};