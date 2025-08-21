
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../../../services/api';
import { WithdrawalRequest } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/layout/Modal';
import { Input } from '../../../components/ui/Input';

export const WithdrawalManagementTab: React.FC = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showDenialModal, setShowDenialModal] = useState<WithdrawalRequest | null>(null);
    const [denialReason, setDenialReason] = useState('');

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.adminListWithdrawals();
            setRequests(data);
        } catch (err: any) {
            setError(err.message || "Failed to load withdrawal requests.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        setError('');
        try {
            await api.adminApproveWithdrawal(id);
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err: any) {
            setError(err.message || `Failed to approve request.`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDenySubmit = async () => {
        if (!showDenialModal) return;
        setProcessingId(showDenialModal.id);
        setError('');
        try {
            await api.adminDenyWithdrawal(showDenialModal.id, denialReason);
            setRequests(prev => prev.filter(req => req.id !== showDenialModal.id));
            closeDenialModal();
        } catch (err: any) {
            setError(err.message || `Failed to deny request.`);
        } finally {
            setProcessingId(null);
        }
    };

    const closeDenialModal = () => {
        setShowDenialModal(null);
        setDenialReason('');
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('admin.withdrawals.title')}</h1>

            {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md mb-4">{error}</div>}

            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    {requests.length > 0 ? (
                        <table className="w-full text-left">
                            <thead className="bg-brand-dark/50">
                                <tr>
                                    <th className="p-4 font-semibold text-brand-white">{t('dashboard.history.date')}</th>
                                    <th className="p-4 font-semibold text-brand-white">{t('admin.userManagement.table.name')}</th>
                                    <th className="p-4 font-semibold text-brand-white hidden md:table-cell">{t('admin.withdrawals.method')}</th>
                                    <th className="p-4 font-semibold text-right text-brand-white">{t('dashboard.history.amount')}</th>
                                    <th className="p-4 font-semibold text-center text-brand-white">{t('admin.userManagement.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} className="border-b border-brand-ui-element/20 last:border-0 hover:bg-brand-ui-element/10">
                                        <td className="p-4 whitespace-nowrap">{new Date(req.date).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <div>{req.userName}</div>
                                            <div className="text-xs text-brand-light-gray">{req.userEmail}</div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell">
                                            <div className="font-semibold">{req.bank_name}</div>
                                            <div className="text-xs text-brand-light-gray truncate max-w-xs">{req.account_name} - (...{req.account_number.slice(-4)})</div>
                                        </td>
                                        <td className="p-4 font-mono text-right text-error">£{parseFloat(req.amount).toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="secondary" 
                                                    className="bg-success/80 hover:bg-success"
                                                    onClick={() => handleApprove(req.id)}
                                                    isLoading={processingId === req.id}
                                                    disabled={!!processingId}
                                                >
                                                    {t('admin.withdrawals.approve')}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="danger"
                                                    onClick={() => setShowDenialModal(req)}
                                                    isLoading={processingId === req.id}
                                                    disabled={!!processingId}
                                                >
                                                    {t('admin.withdrawals.deny')}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center p-8 text-brand-light-gray">
                            {t('admin.withdrawals.noRequests')}
                        </div>
                    )}
                </div>
            </div>
            
            {showDenialModal && (
                <Modal isOpen={!!showDenialModal} onClose={closeDenialModal} title={t('admin.kyc.rejectionModal.title')}>
                    <div className="space-y-4">
                        <p>{t('admin.kyc.rejectionModal.prompt', { name: showDenialModal.userName })}</p>
                        <Input 
                            label={t('admin.kyc.rejectionModal.reasonLabel')}
                            value={denialReason}
                            onChange={(e) => setDenialReason(e.target.value)}
                            placeholder={t('admin.kyc.rejectionModal.reasonPlaceholder')}
                            required
                        />
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={closeDenialModal}>{t('admin.userDetailModal.cancel')}</Button>
                            <Button variant="danger" onClick={handleDenySubmit} isLoading={processingId === showDenialModal.id}>{t('admin.kyc.rejectionModal.confirm')}</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
