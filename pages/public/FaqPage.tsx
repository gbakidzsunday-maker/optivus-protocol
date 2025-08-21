
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AccordionItem } from '../../components/ui/Accordion';

interface FaqItem {
    question: string;
    answer: string;
}

export const FaqPage: React.FC = () => {
    const { t } = useTranslation();
    const faqs = t('faqPage.faqs', { returnObjects: true });

    return (
        <PageWrapper title={t('faqPage.title')}>
            <div className="space-y-2">
                {Array.isArray(faqs) && (faqs as FaqItem[]).map((faq, index) => (
                    <AccordionItem key={index} title={faq.question}>
                        <p>{faq.answer}</p>
                    </AccordionItem>
                ))}
            </div>
        </PageWrapper>
    );
};