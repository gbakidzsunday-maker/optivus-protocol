import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import * as api from '../../services/api';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { PasswordInput } from '../../components/ui/PasswordInput';

export const ResetPasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [token, setToken] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tokenFromUrl = searchParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            setError(t('resetPasswordPage.errorToken'));
        }
    }, [location, t]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (password !== confirmPassword) {
            setError(t('forms.errors.passwordsDoNotMatch'));
            return;
        }
        if (!token) {
            setError('Invalid token.');
            return;
        }

        setIsLoading(true);
        try {
            await api.resetPassword(token, password);
            setMessage('Your password has been reset successfully.');
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClasses = "bg-white/10 backdrop-blur-sm border-white/20 rounded-full py-3 px-5 focus:bg-white/20 w-full";

    return (
        <AuthLayout
            title={t('resetPasswordPage.title')}
            subtitle={t('resetPasswordPage.subtitle')}
        >
            <div className="w-full max-w-md">
                {success ? (
                    <div className="space-y-4 bg-brand-panel/50 backdrop-blur-md border border-brand-ui-element/30 p-8 rounded-2xl">
                         <div className="mx-auto bg-success/20 w-16 h-16 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{t('resetPasswordPage.success.title')}</h2>
                        <p className="text-brand-light-gray">{message}</p>
                        <Button onClick={() => navigate('/login')} className="w-full !rounded-full mt-4">{t('resetPasswordPage.success.button')}</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                        <PasswordInput
                            placeholder={t('resetPasswordPage.newPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={!token || isLoading}
                            className={inputClasses}
                        />
                         <PasswordInput
                            placeholder={t('resetPasswordPage.confirmNewPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={!token || isLoading}
                            className={inputClasses}
                        />
                        <Button type="submit" size="lg" className="w-full !rounded-full !text-lg" isLoading={isLoading} disabled={!token}>
                            {t('resetPasswordPage.button')}
                        </Button>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};
