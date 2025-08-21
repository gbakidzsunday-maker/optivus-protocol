
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { Logo } from '../ui/Logo';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
      isActive ? 'bg-brand-primary text-brand-white shadow-lg' : 'text-brand-light-gray hover:bg-brand-ui-element/50 hover:text-brand-white'
    }`}
  >
    {icon}
    <span className="mx-4 font-medium">{label}</span>
  </button>
);

const AdminProfileCard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <div className="px-4 py-2 mb-4 border-b border-brand-ui-element/20">
            <div className="flex items-center p-2 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-tr from-error to-warning rounded-full flex items-center justify-center font-bold text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div className="ml-3">
                    <p className="font-semibold text-brand-white">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-brand-light-gray">{user?.role === 'admin' ? t('admin.sidebar.role') : user?.username}</p>
                </div>
            </div>
        </div>
    )
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, isSidebarOpen }) => {
  const { t } = useTranslation();
  const tabs = [
    { id: 'overview', label: t('admin.sidebar.overview'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'users', label: t('admin.sidebar.userManagement'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" /></svg> },
    { id: 'kyc', label: t('admin.sidebar.kycManagement'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h4a2 2 0 012 2v1m-4 0h4" /></svg> },
    { id: 'withdrawals', label: t('admin.sidebar.withdrawals'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'transactions', label: t('admin.sidebar.transactions'), icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  ];

  return (
    <aside className={`fixed md:relative z-30 flex-shrink-0 w-64 h-screen bg-brand-dark border-r border-brand-ui-element/20 overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="py-4 text-gray-500">
        <div className="ml-6">
            <Logo />
        </div>
        <AdminProfileCard />
        <nav className="mt-4 px-2 space-y-2">
            {tabs.map(tab => (
                 <NavItem key={tab.id} label={tab.label} icon={tab.icon} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
            ))}
        </nav>
      </div>
    </aside>
  );
};
