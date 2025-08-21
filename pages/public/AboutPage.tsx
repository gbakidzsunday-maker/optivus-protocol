
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageWrapper } from '../../components/layout/PageWrapper';

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start my-2">
        <svg className="flex-shrink-0 h-6 w-6 text-success mr-2 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>{children}</span>
    </li>
);

const InfoItem: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row py-2 border-b border-brand-ui-element/10 last:border-b-0">
        <strong className="w-full sm:w-1/3 text-brand-light-gray/90 shrink-0">{label}</strong>
        <span className="w-full sm:w-2/3">{value}</span>
    </div>
);


export const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const sovPoints = t('aboutPage.tokenomics.sovPoints', { returnObjects: true }) as string[];
  const liquidityPoints = t('aboutPage.tokenomics.liquidityPoints', { returnObjects: true }) as string[];
  const growthEngineItems = t('aboutPage.growthEngine.listItems', { returnObjects: true }) as string[];
  const advancedTokenomicsItems = t('aboutPage.advancedTokenomics.listItems', { returnObjects: true }) as string[];
  const burnList = t('aboutPage.optionalFeatures.burnList', { returnObjects: true }) as string[];
  const stakingList = t('aboutPage.optionalFeatures.stakingList', { returnObjects: true }) as string[];
  const pillars = t('aboutPage.positioning.pillars', { returnObjects: true }) as string[];
  const taglines = t('aboutPage.positioning.taglines', { returnObjects: true }) as string[];
  const audiences = t('aboutPage.marketFit.audiences', { returnObjects: true }) as string[];
  const governanceItems = t('aboutPage.governance.listItems', { returnObjects: true }) as string[];

  return (
    <PageWrapper title={t('aboutPage.title')}>
      <div className="text-right text-brand-light-gray/80 mb-6 -mt-4">
        <p>{t('aboutPage.version')}</p>
      </div>

      <section>
        <h2>{t('aboutPage.abstract.title')}</h2>
        <p>{t('aboutPage.abstract.p1')}</p>
      </section>

      <section>
        <h2>{t('aboutPage.introduction.title')}</h2>
        <p>{t('aboutPage.introduction.p1')}</p>
      </section>

      <section>
        <h2>{t('aboutPage.visionMission.title')}</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">{t('aboutPage.visionMission.visionTitle')}</h3>
        <p>{t('aboutPage.visionMission.visionText')}</p>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">{t('aboutPage.visionMission.missionTitle')}</h3>
        <p>{t('aboutPage.visionMission.missionText')}</p>
      </section>
      
      <section>
        <h2>{t('aboutPage.tokenOverview.title')}</h2>
        <div className="space-y-1 my-4 p-4 border border-brand-ui-element/20 rounded-lg bg-brand-panel/50">
            <InfoItem label={t('aboutPage.tokenOverview.name')} value="Optivus Protocol" />
            <InfoItem label={t('aboutPage.tokenOverview.symbol')} value="OPTIV" />
            <InfoItem label={t('aboutPage.tokenOverview.supply')} value="10,000,000,000 OPTI" />
            <InfoItem label={t('aboutPage.tokenOverview.price')} value="$0.0001" />
            <InfoItem label={t('aboutPage.tokenOverview.liquidity')} value="$10,000" />
            <InfoItem label={t('aboutPage.tokenOverview.pairings')} value="OPTIV/USDC and OPTIV/SOL" />
            <InfoItem label={t('aboutPage.tokenOverview.minting')} value="No additional minting post-launch" />
            <InfoItem label={t('aboutPage.tokenOverview.burn')} value="Optional activation (manual/auto)" />
            <InfoItem label={t('aboutPage.tokenOverview.staking')} value="Under consideration (non-inflationary)" />
        </div>
      </section>

      <section>
        <h2>{t('aboutPage.tokenomics.title')}</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">{t('aboutPage.tokenomics.sovTitle')}</h3>
        <p>{t('aboutPage.tokenomics.sovText')}</p>
        <ul className="space-y-2 my-4">
            {Array.isArray(sovPoints) && sovPoints.map((point, index) => (
                <li key={index}>{point}</li>
            ))}
        </ul>
        <p>{t('aboutPage.tokenomics.sovConclusion')}</p>

        <h3 className="text-2xl font-semibold text-brand-white mt-6 mb-2 !border-none">{t('aboutPage.tokenomics.liquidityTitle')}</h3>
        <p>{t('aboutPage.tokenomics.liquidityText')}</p>
        <div className="my-4 p-4 border border-brand-ui-element rounded-lg bg-brand-panel/50">
            <p className="font-bold text-brand-secondary">{t('aboutPage.tokenomics.pool1Title')}</p>
            <p>{t('aboutPage.tokenomics.pool1Text1')}</p>
            <p className="mt-2 text-sm text-brand-light-gray">{t('aboutPage.tokenomics.pool1Text2')}</p>
        </div>
        <div className="my-4 p-4 border border-brand-ui-element rounded-lg bg-brand-panel/50">
            <p className="font-bold text-brand-secondary">{t('aboutPage.tokenomics.pool2Title')}</p>
            <p>{t('aboutPage.tokenomics.pool2Text1')}</p>
            <p className="mt-2 text-sm text-brand-light-gray">{t('aboutPage.tokenomics.pool2Text2')}</p>
        </div>
        <ul>
            {Array.isArray(liquidityPoints) && liquidityPoints.map((point, index) => (
                <CheckListItem key={index}>{point}</CheckListItem>
            ))}
        </ul>
      </section>

      <section>
        <h2>{t('aboutPage.growthEngine.title')}</h2>
        <p>{t('aboutPage.growthEngine.p1')}</p>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">{t('aboutPage.growthEngine.listTitle')}</h3>
        <ul className="my-4 list-disc list-inside">
            {Array.isArray(growthEngineItems) && growthEngineItems.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
        <p>{t('aboutPage.growthEngine.p2')}</p>
      </section>

      <section>
        <h2>{t('aboutPage.advancedTokenomics.title')}</h2>
        <ul className="space-y-2 my-4 list-disc list-inside">
            {Array.isArray(advancedTokenomicsItems) && advancedTokenomicsItems.map((item, index) => (
                 <li key={index}>{item}</li>
            ))}
        </ul>
      </section>

      <section>
        <h2>{t('aboutPage.optionalFeatures.title')}</h2>
        <h3 className="text-2xl font-semibold text-brand-white mt-4 mb-2 !border-none">{t('aboutPage.optionalFeatures.burnTitle')}</h3>
        <p>{t('aboutPage.optionalFeatures.burnText')}</p>
        <ul className="my-2 ml-4 list-disc list-inside">
            {Array.isArray(burnList) && burnList.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
        <p><strong>{t('aboutPage.optionalFeatures.burnGoal')}</strong></p>

        <h3 className="text-2xl font-semibold text-brand-white mt-6 mb-2 !border-none">{t('aboutPage.optionalFeatures.stakingTitle')}</h3>
        <ul className="my-4 list-disc list-inside">
            {Array.isArray(stakingList) && stakingList.map((item, index) => (
                 <li key={index}>{item}</li>
            ))}
        </ul>
      </section>
      
      <section>
        <h2>{t('aboutPage.positioning.title')}</h2>
        <p className="italic"><strong>{t('aboutPage.positioning.identity')}</strong></p>
        <h3 className="text-xl font-semibold text-brand-light-gray/90 mt-4 mb-2 !border-none">{t('aboutPage.positioning.pillarsTitle')}</h3>
        <ul className="list-disc list-inside">
             {Array.isArray(pillars) && pillars.map((item, index) => (
                 <li key={index}>{item}</li>
            ))}
        </ul>
        <h3 className="text-xl font-semibold text-brand-light-gray/90 mt-4 mb-2 !border-none">{t('aboutPage.positioning.taglinesTitle')}</h3>
        <ul className="list-disc list-inside">
            {Array.isArray(taglines) && taglines.map((item, index) => (
                 <li key={index}>{item}</li>
            ))}
        </ul>
      </section>

      <section>
        <h2>{t('aboutPage.marketFit.title')}</h2>
        <h3 className="text-xl font-semibold text-brand-light-gray/90 mt-4 mb-2 !border-none">{t('aboutPage.marketFit.audienceTitle')}</h3>
        <ul className="space-y-2 my-4 list-disc list-inside">
            {Array.isArray(audiences) && audiences.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
      </section>
      
      <section>
        <h2>{t('aboutPage.governance.title')}</h2>
        <p>{t('aboutPage.governance.p1')}</p>
        <ul className="my-4 list-disc list-inside">
            {Array.isArray(governanceItems) && governanceItems.map((item, index) => (
                 <li key={index}>{item}</li>
            ))}
        </ul>
        <p>{t('aboutPage.governance.p2')}</p>
      </section>

      <section>
        <h2>{t('aboutPage.summary.title')}</h2>
        <div className="space-y-1 my-4 p-4 border border-brand-ui-element/20 rounded-lg bg-brand-panel/50">
            <InfoItem label={t('aboutPage.tokenOverview.supply')} value={t('aboutPage.summary.supply')} />
            <InfoItem label={t('aboutPage.summary.inflation_label')} value={t('aboutPage.summary.inflation')} />
            <InfoItem label={t('aboutPage.summary.burn_label')} value={t('aboutPage.summary.burn')} />
            <InfoItem label={t('aboutPage.summary.staking_label')} value={t('aboutPage.summary.staking')} />
            <InfoItem label={t('aboutPage.tokenOverview.price')} value={t('aboutPage.summary.price')} />
            <InfoItem label={t('aboutPage.summary.liquidity_label')} value={t('aboutPage.summary.liquidity')} />
            <InfoItem label={t('aboutPage.summary.narrative_label')} value={t('aboutPage.summary.narrative')} />
            <InfoItem label={t('aboutPage.summary.ethos_label')} value={t('aboutPage.summary.ethos')} />
        </div>
      </section>

      <section>
        <h2>{t('aboutPage.closing.title')}</h2>
        <p>{t('aboutPage.closing.p1')}</p>
      </section>
    </PageWrapper>
  );
};
