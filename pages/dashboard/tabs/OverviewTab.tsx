import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../services/api';
import { StatCard } from '../../../components/ui/StatCard';
import { Spinner } from '../../../components/ui/Spinner';
import { DashboardStats, DownlineLevel } from '../../../types';
import { ReferralCard } from '../../../components/dashboard/ReferralCard';

export const OverviewTab: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [downline, setDownline] = useState<DownlineLevel[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const statsData = await api.getDashboardStats();
            setStats(statsData);
            setDownline([]); // No endpoint for downline data in API yet
        } catch (err) {
            setError('Failed to load dashboard data.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) return <Spinner />;
    if (error) return <div className="text-error text-center p-4">{error}</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('dashboard.overview.welcome', { name: user?.username })}</h1>
                <p className="mt-1 text-brand-light-gray">{t('dashboard.overview.subtitle')}</p>
            </div>
            
            <ReferralCard />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title={t('dashboard.overview.totalEarnings')} 
                    value={`£${parseFloat(stats?.totalEarnings || '0').toFixed(2)}`} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                />
                <StatCard 
                    title={t('dashboard.overview.totalTeamSize')} 
                    value={stats?.totalTeamSize || 0}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard 
                    title={t('dashboard.overview.directReferrals')} 
                    value={stats?.directReferrals || 0}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
                />
            </div>
            
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">{t('dashboard.overview.downlineTitle')}</h2>
                <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg overflow-hidden">
                    {downline && downline.length > 0 ? (
                    <>
                        {/* Mobile View */}
                        <div className="md:hidden">
                            <div className="p-4 space-y-3">
                                {downline?.map(level => (
                                    <div key={level.level} className="bg-brand-dark/40 p-4 rounded-lg border border-brand-ui-element/20">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-white">{t('dashboard.overview.level')} {level.level}</span>
                                            <span className="font-semibold text-brand-secondary">£{level.earnings.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-brand-light-gray mt-1">{level.users} {t('dashboard.overview.users')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-dark/50">
                                    <tr>
                                        <th className="p-4 font-semibold text-brand-white">{t('dashboard.overview.level')}</th>
                                        <th className="p-4 font-semibold text-brand-white">{t('dashboard.overview.users')}</th>
                                        <th className="p-4 font-semibold text-brand-white">{t('dashboard.overview.earningsFromTier')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {downline?.map(level => (
                                        <tr key={level.level} className="border-b border-brand-ui-element/20 last:border-0">
                                            <td className="p-4">{level.level}</td>
                                            <td className="p-4">{level.users}</td>
                                            <td className="p-4 text-brand-secondary">£{level.earnings.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                    ) : (
                        <p className="text-center p-8 text-brand-light-gray">Downline data is not available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
