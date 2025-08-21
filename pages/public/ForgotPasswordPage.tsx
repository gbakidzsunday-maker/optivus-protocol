import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import * as api from '../../services/api';
import { AuthLayout } from '../../components/layout/AuthLayout';


export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
        await api.requestPasswordReset(email);
        setMessage(t('forgotPasswordPage.success.message'));
        setSuccess(true);
    } catch (err: any) {
        // Even on error, show the generic success message for security to prevent email enumeration.
        setMessage(t('forgotPasswordPage.success.message'));
        setSuccess(true); 
    } finally {
        setIsLoading(false);
    }
  };
  
  const inputClasses = "bg-white/10 backdrop-blur-sm border-white/20 rounded-full py-3 px-5 focus:bg-white/20 w-full";

  return (
    <AuthLayout
        title={t('forgotPasswordPage.title')}
        subtitle={t('forgotPasswordPage.subtitle')}
    >
        <div className="w-full max-w-md">
            {success ? (
                <div className="bg-brand-panel/50 backdrop-blur-md border border-brand-ui-element/30 p-8 rounded-2xl space-y-4">
                    <div className="mx-auto bg-success/20 w-16 h-16 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('forgotPasswordPage.success.title')}</h2>
                    <p className="text-brand-light-gray">{message}</p>
                    <Button onClick={() => navigate('/login')} className="w-full !rounded-full mt-4">{t('forgotPasswordPage.success.button')}</Button>
                </div>
            ) : (
                 <>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm">{error}</div>}
                        <Input
                            placeholder={t('loginPage.form.email')}
                            id="forgot-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={inputClasses}
                            aria-label="Email Address"
                        />
                        <Button type="submit" size="lg" className="w-full !rounded-full !text-lg" isLoading={isLoading}>
                            {t('forgotPasswordPage.button')}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-brand-light-gray mt-8">
                        {t('forgotPasswordPage.rememberPassword')}<Link to="/login" className="font-semibold text-brand-secondary hover:underline">{t('header.login')}</Link>
                    </p>
                 </>
            )}
        </div>
    </AuthLayout>
  );
};
