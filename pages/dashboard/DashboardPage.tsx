
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from '../../components/layout/Sidebar';
import { OverviewTab } from './tabs/OverviewTab';
import { WithdrawTab } from './tabs/WithdrawTab';
import { HistoryTab } from './tabs/HistoryTab';
import { KycTab } from './tabs/KycTab';
import { SettingsTab } from './tabs/SettingsTab';
import { TeamTab } from './tabs/TeamTab';
import { Spinner } from '../../components/ui/Spinner';
import { Footer } from '../../components/layout/Footer';
import { Button } from '../../components/ui/Button';

const TABS: { [key: string]: React.ComponentType } = {
  overview: OverviewTab,
  team: TeamTab,
  withdraw: WithdrawTab,
  history: HistoryTab,
  kyc: KycTab,
  settings: SettingsTab,
};

export const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const getTabFromPath = () => {
      const pathParts = location.pathname.split('/');
      const tab = pathParts.length > 2 && pathParts[2] ? pathParts[2] : 'overview';
      return TABS[tab] ? tab : 'overview';
  }

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  useEffect(() => {
      const currentTab = getTabFromPath();
      setActiveTab(currentTab);
      const translatedTab = t(`dashboard.tabs.${currentTab}`);
      document.title = t('dashboard.title', { tab: translatedTab });
  }, [location.pathname, t]);

  const handleSetTab = (tab: string) => {
    navigate(`/dashboard/${tab}`);
    setActiveTab(tab);
    setIsSidebarOpen(false);
  }

  const ActiveTabComponent = TABS[activeTab];

  if (isLoading || !isAuthenticated) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="flex h-screen bg-brand-dark text-brand-white">
        {isSidebarOpen && (
            <div 
                className="fixed inset-0 z-20 bg-black/50 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        )}
        <Sidebar activeTab={activeTab} setActiveTab={handleSetTab} isSidebarOpen={isSidebarOpen}/>
        <div className="flex flex-col flex-1 w-full">
            <header className="z-10 py-4 bg-brand-dark shadow-md border-b border-brand-ui-element/20">
                <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
                    <div className="flex items-center">
                        <button
                            className="p-1 mr-3 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-white capitalize">{t(`dashboard.tabs.${activeTab}`)}</h1>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <a href="https://discord.gg/zGGtpydJxE" target="_blank" rel="noopener noreferrer" aria-label={t('dashboard.discordAria')} className="text-brand-light-gray/80 hover:text-brand-white transition-colors p-2 rounded-full hover:bg-brand-ui-element/50">
                            <img src="https://i.imgur.com/muFS1AD.png" alt="Discord" className="h-6 w-6" />
                        </a>
                        <Button onClick={logout} variant="outline" size="sm">{t('header.logout')}</Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="container px-4 sm:px-6 mx-auto py-8">
                    {ActiveTabComponent ? <ActiveTabComponent /> : <OverviewTab />}
                </div>
                <Footer />
            </main>
        </div>
    </div>
  );
};
