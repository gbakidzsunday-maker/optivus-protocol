import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../services/api';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';

const WithdrawalForm: React.FC<{ 
    balance: string;
}> = ({ balance }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        amount: '',
        bank_name: '',
        account_number: '',
        account_name: ''
    });
    const [pin, setPin] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [needsPinVerification, setNeedsPinVerification] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerifyPin = async () => {
        setError('');
        setIsLoading(true);
        try {
            await api.verifyPin(pin);
            setNeedsPinVerification(false);
            setMessage("PIN verified successfully. You can now submit your withdrawal.");
        } catch (err: any) {
            setError(err.message || 'PIN verification failed.');
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const withdrawalAmount = parseFloat(formData.amount);
        const availableBalance = parseFloat(balance);

        if (withdrawalAmount > availableBalance) {
            setError('Withdrawal amount cannot exceed your available balance.');
            return;
        }

        setIsLoading(true);
        try {
            await api.createWithdrawal({
                ...formData,
                amount: withdrawalAmount.toFixed(2), // Ensure amount is a string with 2 decimal places
            });
            setMessage('Withdrawal request submitted successfully.');
            setFormData({ amount: '', bank_name: '', account_number: '', account_name: '' });
            setPin('');
            setNeedsPinVerification(true);
        } catch (err: any) {
            setError(err.message || 'Withdrawal failed.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (needsPinVerification) {
        return (
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">{t('dashboard.withdraw.form.pinLabel')}</h3>
                <p className="text-sm text-brand-light-gray">For your security, please verify your PIN to proceed with the withdrawal.</p>
                {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
                {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
                <Input label="PIN" type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter your PIN" required maxLength={6} />
                <Button onClick={handleVerifyPin} className="w-full" isLoading={isLoading}>Verify PIN</Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-xl font-semibold text-white">{t('dashboard.withdraw.form.title')}</h3>
            {message && <div className="text-success p-2 rounded bg-success/10 border border-success">{message}</div>}
            {error && <div className="text-error p-2 rounded bg-error/10 border border-error">{error}</div>}
            
            <Input label={t('dashboard.withdraw.form.amountLabel')} name="amount" type="number" step="0.01" value={formData.amount} onChange={handleInputChange} placeholder="0.00" required />
            <Input label="Bank Name" name="bank_name" type="text" value={formData.bank_name} onChange={handleInputChange} placeholder="e.g., Bank of Example" required />
            <Input label="Account Number" name="account_number" type="text" value={formData.account_number} onChange={handleInputChange} placeholder="e.g., 1234567890" required />
            <Input label="Account Name" name="account_name" type="text" value={formData.account_name} onChange={handleInputChange} placeholder="e.g., John Doe" required />

            <Button type="submit" className="w-full" isLoading={isLoading}>{t('dashboard.withdraw.form.button')}</Button>
        </form>
    );
};

export const WithdrawTab: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Simulating loading user data
        if (user) {
            setIsLoading(false);
        }
    }, [user]);

    if (isLoading || !user) return <Spinner />;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('dashboard.withdraw.title')}</h1>
            <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg text-center">
                <p className="text-sm text-brand-light-gray">{t('dashboard.withdraw.balanceTitle')}</p>
                <p className="text-4xl font-bold text-brand-secondary">£{parseFloat(user.balance || '0').toFixed(2)}</p>
            </div>
            
            <div className="max-w-md mx-auto">
                <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-6 rounded-lg">
                    {user?.is_kyc_verified ? (
                       <WithdrawalForm 
                          balance={user.balance || '0'}
                       />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-warning mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <h3 className="text-xl font-semibold text-white">{t('dashboard.withdraw.kyc.title')}</h3>
                            <p className="text-brand-light-gray mt-2">{t('dashboard.withdraw.kyc.subtitle')}</p>
                            <Button onClick={() => window.location.hash = '/dashboard/kyc'} variant="outline" className="mt-4">{t('dashboard.withdraw.kyc.button')}</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
