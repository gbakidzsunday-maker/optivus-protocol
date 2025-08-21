import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../../../services/api';
import { Transaction } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';

const StatusBadge: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const { t } = useTranslation();
    const statusKey = status.toLowerCase();
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full inline-block capitalize';
    const variantClasses = {
        completed: 'bg-success/20 text-success',
        pending: 'bg-warning/20 text-warning',
        failed: 'bg-error/20 text-error',
    };
    return <span className={`${baseClasses} ${variantClasses[status as keyof typeof variantClasses]}`}>{t(`common.status.${statusKey}`)}</span>;
}

export const AdminTransactionsTab: React.FC = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.adminListTransactions();
            setTransactions(data);
        } catch (error: any) {
            setError(error.message || 'Failed to load transactions.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('admin.transactions.title')}</h1>
            {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md mb-4">{error}</div>}
            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg overflow-hidden">
                {isLoading ? <Spinner /> : (
                    <>
                        {/* Mobile View */}
                        <div className="md:hidden">
                            <div className="p-4 space-y-4">
                                {transactions.map(tx => {
                                    const amount = parseFloat(tx.amount);
                                    return (
                                        <div key={tx.id} className="bg-brand-dark/30 p-4 rounded-lg border border-brand-ui-element/20">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-bold text-white capitalize">{tx.tx_type}</p>
                                                    {tx.user ? (
                                                        <>
                                                            <p className="text-sm text-brand-light-gray">{tx.user.name}</p>
                                                            <p className="text-xs text-brand-ui-element/80">{tx.user.email}</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-brand-light-gray">N/A</p>
                                                    )}
                                                    <p className="text-xs text-brand-ui-element/80 mt-1">{tx.reference}</p>
                                                </div>
                                                <p className={`font-mono text-lg shrink-0 ml-4 ${amount >= 0 ? 'text-success' : 'text-error'}`}>
                                                    {amount >= 0 ? '+' : ''}£{Math.abs(amount).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-brand-ui-element/80">
                                                <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                                                <StatusBadge status={tx.status} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-dark/50">
                                    <tr>
                                        <th className="p-4 font-semibold text-brand-white">{t('dashboard.history.date')}</th>
                                        <th className="p-4 font-semibold text-brand-white">{t('admin.userManagement.table.name')}</th>
                                        <th className="p-4 font-semibold text-brand-white">{t('dashboard.history.type')}</th>
                                        <th className="p-4 font-semibold text-brand-white">{t('dashboard.history.description')}</th>
                                        <th className="p-4 font-semibold text-right text-brand-white">{t('dashboard.history.amount')}</th>
                                        <th className="p-4 font-semibold text-center text-brand-white">{t('dashboard.history.status')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map(tx => {
                                        const amount = parseFloat(tx.amount);
                                        return (
                                            <tr key={tx.id} className="border-b border-brand-ui-element/20 last:border-0 hover:bg-brand-ui-element/10">
                                                <td className="p-4 whitespace-nowrap">{new Date(tx.created_at).toLocaleDateString()}</td>
                                                <td className="p-4">
                                                    {tx.user ? (
                                                        <>
                                                            <div>{tx.user.name}</div>
                                                            <div className="text-xs text-brand-light-gray">{tx.user.email}</div>
                                                        </>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="p-4 capitalize">{tx.tx_type}</td>
                                                <td className="p-4 text-brand-light-gray">{tx.reference}</td>
                                                <td className={`p-4 font-mono text-right ${amount >= 0 ? 'text-success' : 'text-error'}`}>
                                                    {amount >= 0 ? '+' : ''}£{Math.abs(amount).toFixed(2)}
                                                </td>
                                                <td className="p-4 text-center"><StatusBadge status={tx.status} /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
