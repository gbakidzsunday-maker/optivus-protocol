import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as api from '../../../services/api';
import { KycRequest } from '../../../types';
import { Spinner } from '../../../components/ui/Spinner';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/layout/Modal';
import { Input } from '../../../components/ui/Input';

export const KycManagementTab: React.FC = () => {
    const { t } = useTranslation();
    const [requests, setRequests] = useState<KycRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showRejectionModal, setShowRejectionModal] = useState<KycRequest | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await api.adminListKycRequests();
            setRequests(data);
        } catch (err: any) {
            setError(err.message || "Failed to load KYC requests.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await api.adminProcessKyc(id, 'approve');
            setRequests(prev => prev.filter(req => req.id !== id));
        } catch (err: any) {
            setError(err.message || `Failed to approve request.`);
        } finally {
            setProcessingId(null);
        }
    };
    
    const handleReject = async () => {
        if (!showRejectionModal) return;
        setProcessingId(showRejectionModal.id);
        try {
            await api.adminProcessKyc(showRejectionModal.id, 'reject', rejectionReason);
            setRequests(prev => prev.filter(req => req.id !== showRejectionModal.id));
            closeRejectionModal();
        } catch (err: any) {
             setError(err.message || `Failed to reject request.`);
        } finally {
            setProcessingId(null);
        }
    }
    
    const closeRejectionModal = () => {
        setShowRejectionModal(null);
        setRejectionReason('');
    }

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('admin.kyc.title')}</h1>
            {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md mb-4">{error}</div>}

            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg shadow-lg overflow-hidden">
                 {requests.length > 0 ? (
                    requests.map(req => (
                        <div key={req.id} className="p-4 border-b border-brand-ui-element/20 last:border-b-0">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="font-semibold text-white">{req.userName}</p>
                                    <p className="text-sm text-brand-light-gray">{req.userEmail}</p>
                                    <p className="text-xs text-brand-ui-element/80">{t('admin.kyc.submitted')} {new Date(req.dateSubmitted).toLocaleDateString()}</p>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                    <div>
                                        <h4 className="font-semibold text-sm">{t('admin.kyc.viewDocument')}</h4>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                            <a href={req.documentFrontUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary hover:underline">Front</a>
                                            {req.documentBackUrl && <a href={req.documentBackUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary hover:underline">Back</a>}
                                            <a href={req.selfieUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-secondary hover:underline">Selfie</a>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                         <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            className="bg-success/80 hover:bg-success"
                                            onClick={() => handleApprove(req.id)}
                                            isLoading={processingId === req.id}
                                            disabled={!!processingId}
                                        >{t('admin.withdrawals.approve')}</Button>
                                         <Button 
                                            size="sm" 
                                            variant="danger"
                                            onClick={() => setShowRejectionModal(req)}
                                            isLoading={processingId === req.id}
                                            disabled={!!processingId}
                                        >{t('admin.withdrawals.deny')}</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                 ) : (
                    <div className="text-center p-8 text-brand-light-gray">
                        {t('admin.kyc.noRequests')}
                    </div>
                 )}
            </div>

            {showRejectionModal && (
                <Modal isOpen={!!showRejectionModal} onClose={closeRejectionModal} title={t('admin.kyc.rejectionModal.title')}>
                    <div className="space-y-4">
                        <p>{t('admin.kyc.rejectionModal.prompt', { name: showRejectionModal.userName })}</p>
                        <Input 
                            label={t('admin.kyc.rejectionModal.reasonLabel')}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder={t('admin.kyc.rejectionModal.reasonPlaceholder')}
                        />
                        <div className="flex justify-end gap-4">
                            <Button variant="outline" onClick={closeRejectionModal}>{t('admin.userDetailModal.cancel')}</Button>
                            <Button variant="danger" onClick={handleReject} isLoading={processingId === showRejectionModal.id}>{t('admin.kyc.rejectionModal.confirm')}</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
