
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui/Spinner';
import { AdminSidebar } from '../../components/layout/AdminSidebar';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/layout/Footer';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { UserManagementTab } from './tabs/UserManagementTab';
import { AdminTransactionsTab } from './tabs/AdminTransactionsTab';
import { WithdrawalManagementTab } from './tabs/WithdrawalManagementTab';
import { KycManagementTab } from './tabs/KycManagementTab';

const ADMIN_TABS: { [key: string]: React.ComponentType } = {
  overview: AdminOverviewTab,
  users: UserManagementTab,
  kyc: KycManagementTab,
  withdrawals: WithdrawalManagementTab,
  transactions: AdminTransactionsTab,
};

export const AdminPage: React.FC = () => {
  const { isAdmin, isLoading, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
      const pathParts = location.pathname.split('/');
      const tab = pathParts.length > 2 && pathParts[2] ? pathParts[2] : 'overview';
      return ADMIN_TABS[tab] ? tab : 'overview';
  }

  const [activeTab, setActiveTab] = useState(getTabFromPath());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin-login');
    }
  }, [isAdmin, isLoading, navigate]);
  
  useEffect(() => {
      const currentTab = getTabFromPath();
      setActiveTab(currentTab);
      const translatedTab = t(`admin.sidebar.${currentTab}`);
      document.title = t('admin.title', { tab: translatedTab });
  }, [location.pathname, t]);

  const handleSetTab = (tab: string) => {
    navigate(`/admin/${tab}`);
    setActiveTab(tab);
    setIsSidebarOpen(false);
  }

  const ActiveTabComponent = ADMIN_TABS[activeTab];

  if (isLoading || !isAdmin) {
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
        <AdminSidebar activeTab={activeTab} setActiveTab={handleSetTab} isSidebarOpen={isSidebarOpen}/>
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
                        <h1 className="text-xl md:text-2xl font-bold text-white capitalize">{t('admin.title', { tab: t(`admin.sidebar.${activeTab}`) })}</h1>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <Button onClick={logout} variant="outline" size="sm">{t('header.logout')}</Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto">
                <div className="container px-4 sm:px-6 mx-auto py-8">
                    {ActiveTabComponent ? <ActiveTabComponent /> : <AdminOverviewTab />}
                </div>
                <Footer />
            </main>
        </div>
    </div>
  );
};
