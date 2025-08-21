import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../../../services/api';
import { TeamMember } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';
import { StatCard } from '../../../components/ui/StatCard';

// Recursive TreeNode component
const TreeNode: React.FC<{ node: TeamMember; level: number; }> = ({ node, level }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first two levels
    const hasChildren = node.children && node.children.length > 0;

    return (
        <div>
            <div 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-brand-ui-element/20 transition-colors cursor-pointer"
                style={{ paddingLeft: `${level * 24 + 8}px` }}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            >
                {/* Expander Icon */}
                <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                    {hasChildren && (
                        <svg className={`h-4 w-4 text-brand-light-gray transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    )}
                </div>
                
                {/* User Info */}
                <div className="w-8 h-8 bg-gradient-to-tr from-brand-primary to-brand-secondary rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                    {node.name.charAt(0)}{node.name.split(' ').pop()?.charAt(0)}
                </div>
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                    <div>
                        <p className="font-semibold text-white truncate">{node.name}</p>
                        <p className="text-xs text-brand-light-gray">@{node.username}</p>
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-sm text-brand-light-gray">{t('dashboard.team.joined')}</p>
                        <p className="font-mono text-xs text-white">{new Date(node.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-brand-light-gray">{t('dashboard.team.earningsFrom')}</p>
                        <p className="font-semibold text-brand-secondary">£{parseFloat(node.totalEarningsFrom).toFixed(2)}</p>
                    </div>
                </div>
            </div>
            
            {/* Children */}
            {isExpanded && hasChildren && (
                <div className="border-l border-brand-ui-element/30" style={{ marginLeft: `${level * 24 + 8 + 18}px` }}>
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};


export const TeamTab: React.FC = () => {
    const { t } = useTranslation();
    const [team, setTeam] = useState<TeamMember[] | null>(null);
    const [stats, setStats] = useState<{ totalTeamSize: number; directReferrals: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [teamData, statsData] = await Promise.all([
                api.getTeamTree(),
                api.getDashboardStats(),
            ]);
            setTeam(teamData);
            setStats({
                totalTeamSize: statsData.totalTeamSize,
                directReferrals: statsData.directReferrals,
            });
        } catch (err) {
            setError('Failed to load team data.');
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
                <h1 className="text-3xl font-bold text-white">{t('dashboard.team.title')}</h1>
                <p className="mt-1 text-brand-light-gray">{t('dashboard.team.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <StatCard 
                    title={t('dashboard.team.teamSize')} 
                    value={stats?.totalTeamSize || 0}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard 
                    title={t('dashboard.team.directReferrals')} 
                    value={stats?.directReferrals || 0}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
                />
            </div>
            
            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg">
                <div className="p-4 border-b border-brand-ui-element/20 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">{t('dashboard.team.structureTitle')}</h2>
                </div>
                {team && team.length > 0 ? (
                    <div className="p-2 sm:p-4">
                        {team.map(member => (
                            <TreeNode key={member.id} node={member} level={0} />
                        ))}
                    </div>
                ) : (
                    <p className="p-8 text-center text-brand-light-gray">{t('dashboard.team.noReferrals')}</p>
                )}
            </div>
        </div>
    );
};
