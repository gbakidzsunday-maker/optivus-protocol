
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PasswordInput } from '../../components/ui/PasswordInput';
import * as api from '../../services/api';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { StripePaymentForm } from '../../components/auth/StripePaymentForm';

type FormErrors = {
  [key: string]: string | undefined;
};

export const SignupPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [formDetails, setFormDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setFormDetails(prev => ({ ...prev, referralCode: refCode }));
    }
  }, [location.search]);

  const validateField = (name: string, value: string) => {
    let errorMsg: string | undefined = undefined;
    if (!value) {
        errorMsg = t('forms.errors.fieldRequired');
    } else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errorMsg = 'Please enter a valid email address.';
    } else if (name === 'password' && value.length < 8) {
        errorMsg = 'Password must be at least 8 characters long.';
    } else if (name === 'confirmPassword' && value !== formDetails.password) {
        errorMsg = t('forms.errors.passwordsDoNotMatch');
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
    validateField(name, value);
  };
  
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Re-validate all fields on submit
    Object.entries(formDetails).forEach(([name, value]) => validateField(name, value as string));
    
    if (formDetails.password !== formDetails.confirmPassword) {
      setErrors(prev => ({...prev, confirmPassword: t('forms.errors.passwordsDoNotMatch')}));
    }
    
    const hasErrors = Object.values(errors).some(e => !!e) || Object.values(formDetails).some(v => !v);

    if (hasErrors) {
        setFormError(t('forms.errors.generic'));
        return;
    }
    
    setIsProcessing(true);
    try {
        const response = await api.initiateRegistration(formDetails);
        if (response.clientSecret) {
            setClientSecret(response.clientSecret);
            setStep('payment');
        } else {
            setFormError("Could not initiate payment. Please try again.");
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setFormError(err.message || 'Registration failed.');
        } else {
            setFormError('An unknown error occurred during signup.');
        }
    } finally {
        setIsProcessing(false);
    }
  };
  
  const inputClasses = "bg-white/10 backdrop-blur-sm border-white/20 rounded-full py-3 px-5 focus:bg-white/20 w-full";
  const isFormInvalid = Object.values(errors).some(e => !!e);

  const renderDetailsStep = () => (
    <form onSubmit={handleDetailsSubmit} className="w-full">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-x-8 gap-y-6">
            <div className="text-center lg:text-left flex-shrink-0">
                <h2 className="text-3xl font-bold">{t('signupPage.details.title')}</h2>
                <p className="text-brand-light-gray/80 mt-1 max-w-[250px]">
                    {t('signupPage.details.subtitle')}
                </p>
            </div>

            <div className="flex-grow w-full max-w-lg">
                {formError && <div className="bg-error/10 border border-error text-error p-3 rounded-md text-sm mb-4">{formError}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Input name="referralCode" placeholder={t('signupPage.details.referralCodePlaceholder')} value={formDetails.referralCode} onChange={handleChange} required className={inputClasses} error={errors.referralCode} />
                    </div>
                    <Input name="username" placeholder={t('admin.userDetailModal.username')} value={formDetails.username} onChange={handleChange} required className={inputClasses} error={errors.username} />
                    <Input name="email" type="email" placeholder={t('dashboard.settings.profile.email')} value={formDetails.email} onChange={handleChange} required className={inputClasses} error={errors.email} />
                      <PasswordInput
                        name="password"
                        placeholder={t('dashboard.settings.password.new')}
                        value={formDetails.password}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        error={errors.password}
                        showStrength
                    />
                    <PasswordInput
                        name="confirmPassword"
                        placeholder={t('dashboard.settings.password.confirm')}
                        value={formDetails.confirmPassword}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                        error={errors.confirmPassword}
                    />
                </div>
                <div className="mt-6 flex justify-center">
                    <Button type="submit" size="lg" className="w-full sm:w-1/2 !rounded-full !text-lg" isLoading={isProcessing} disabled={isFormInvalid}>
                        {t('signupPage.payment.button')}
                    </Button>
                </div>
            </div>
        </div>
          <p className="text-center text-sm text-brand-light-gray mt-8 lg:col-span-2">
            {t('signupPage.details.hasAccount')}<Link to="/login" className="font-semibold text-brand-secondary hover:underline">{t('header.login')}</Link>
        </p>
    </form>
  );

  const renderPaymentStep = () => {
    if (!clientSecret) {
        return (
            <div>
                <p className="text-error">Could not initialize payment. Please go back and try again.</p>
                <Button onClick={() => setStep('details')}>Go Back</Button>
            </div>
        );
    }
    return (
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-2">{t('signupPage.paymentModal.title')}</h2>
        <p className="text-brand-light-gray/80 mb-6">{t('signupPage.paymentModal.subtitle')}</p>
        <StripePaymentForm clientSecret={clientSecret} registrationDetails={formDetails} />
      </div>
    );
  };

  return (
    <AuthLayout
      title={t('signupPage.authLayout.title')}
      subtitle={t('signupPage.authLayout.subtitle')}
    >
        <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center flex-grow justify-center py-12">
            {step === 'details' ? renderDetailsStep() : renderPaymentStep()}
        </main>
    </AuthLayout>
  );
};