
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { KycStatusResponse } from '../../../types';

const StatusDisplay: React.FC<{status: 'approved' | 'pending' | 'rejected', message: string, title: string, icon: React.ReactNode, reason?: string | null}> = ({status, message, title, icon, reason}) => (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 rounded-lg">
        <div className={`mb-4 p-4 rounded-full ${status === 'approved' ? 'bg-success/20' : status === 'pending' ? 'bg-warning/20' : 'bg-error/20'}`}>
            {icon}
        </div>
        <h2 className={`text-2xl font-bold ${status === 'approved' ? 'text-success' : status === 'pending' ? 'text-warning' : 'text-error'}`}>{title}</h2>
        <p className="text-brand-light-gray mt-2">{message}</p>
        {status === 'rejected' && reason && (
            <div className="mt-4 text-sm text-error-content bg-error/10 p-3 rounded-md border border-error">
                <strong>Reason for rejection:</strong> {reason}
            </div>
        )}
    </div>
);

export const KycTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { t } = useTranslation();
    
    const [kycStatus, setKycStatus] = useState<KycStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Form state
    const [documentType, setDocumentType] = useState('passport');
    const [documentFront, setDocumentFront] = useState<File | null>(null);
    const [documentBack, setDocumentBack] = useState<File | null>(null);
    const [selfie, setSelfie] = useState<File | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            setIsLoading(true);
            try {
                const statusData = await api.getKycStatus();
                setKycStatus(statusData);
                updateUser({ is_kyc_verified: statusData.status === 'approved' });
            } catch (err: any) {
                setError(err.message || 'Failed to fetch KYC status.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStatus();
    }, [updateUser]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!documentFront || !selfie || (documentType !== 'passport' && !documentBack)) {
            setError('Please upload all required documents.');
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('document_type', documentType);
            formData.append('document_front', documentFront);
            formData.append('selfie', selfie);
            if (documentBack) {
                formData.append('document_back', documentBack);
            }

            const res = await api.submitKyc(formData);
            setMessage('KYC documents submitted successfully.');
            setKycStatus({ status: 'pending', rejection_reason: null });
        } catch(err: any) {
            setError(err.message || 'Verification submission failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading) return <div>Loading...</div>
    if (error && !kycStatus) return <div>Error: {error}</div>

    if (kycStatus?.status === 'pending') {
        return <StatusDisplay 
            status="pending" 
            title={t('dashboard.kyc.pending.title')}
            message={t('dashboard.kyc.pending.message')} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
        />;
    }
    
    if (kycStatus?.status === 'approved') {
        return <StatusDisplay 
            status="approved" 
            title={t('dashboard.kyc.verified.title')}
            message={t('dashboard.kyc.verified.message')} 
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
        />;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('dashboard.kyc.title')}</h1>
            
            {kycStatus?.status === 'rejected' && (
                <div className="p-4 bg-error/10 border border-error text-error rounded-lg">
                    <h3 className="font-bold">{t('dashboard.kyc.rejected.title')}</h3>
                    <p>{t('dashboard.kyc.rejected.reason', { reason: kycStatus.rejection_reason || t('dashboard.kyc.rejected.noReason') })}</p>
                    <p className="mt-2 text-sm">{t('dashboard.kyc.rejected.instruction')}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-8 rounded-lg space-y-6">
                {message && <div className="text-success p-3 rounded bg-success/10 border border-success">{message}</div>}
                {error && <div className="text-error p-3 rounded bg-error/10 border border-error">{error}</div>}

                 <div>
                    <h2 className="text-xl font-semibold text-white">{t('dashboard.kyc.form.docUpload')}</h2>
                    <p className="text-sm text-brand-light-gray mt-1">{t('dashboard.kyc.form.docInstruction')}</p>

                    <div className="mt-4 space-y-4">
                        <div>
                            <label htmlFor="document_type" className="block text-sm font-medium text-brand-light-gray mb-1">Document Type</label>
                            <select 
                                id="document_type"
                                value={documentType}
                                onChange={e => setDocumentType(e.target.value)}
                                className="w-full bg-transparent border border-brand-ui-element rounded-md px-3 py-2 text-brand-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            >
                                <option value="passport">Passport</option>
                                <option value="drivers_license">Driver's License</option>
                                <option value="id_card">National ID Card</option>
                            </select>
                        </div>

                        <Input label="Document Front" type="file" onChange={e => setDocumentFront(e.target.files ? e.target.files[0] : null)} required className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-dark hover:file:opacity-90" />
                        
                        {documentType !== 'passport' && (
                            <Input label="Document Back" type="file" onChange={e => setDocumentBack(e.target.files ? e.target.files[0] : null)} required={documentType !== 'passport'} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-dark hover:file:opacity-90" />
                        )}

                        <Input label="Selfie with Document" type="file" onChange={e => setSelfie(e.target.files ? e.target.files[0] : null)} required className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary file:text-brand-dark hover:file:opacity-90" />
                    </div>
                </div>

                <Button type="submit" className="w-full" isLoading={isLoading}>
                    {kycStatus?.status === 'rejected' ? t('dashboard.kyc.form.resubmitButton') : t('dashboard.kyc.form.submitButton')}
                </Button>
            </form>
        </div>
    );
};
