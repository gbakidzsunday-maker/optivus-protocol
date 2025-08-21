
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Button } from '../ui/Button';
import * as api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

// Use a public test key. In a real application, this would come from an environment variable.
const stripePromise = loadStripe('pk_test_51PboyA2LzD1a3s9xZgP6zBbx6gJ6Dt6Xk6nZjP8yvj8VGFpS259FkPlJp1p7Ww5k10u2qOQkEaKqL3ePlhC5DkAE001HkF4j3R');

interface StripePaymentFormProps {
  registrationDetails: any;
}

const CheckoutForm: React.FC<StripePaymentFormProps> = ({ registrationDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setMessage(submitError.message || "An unexpected error occurred.");
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/#/dashboard`, // Placeholder, we handle redirect manually
      },
      redirect: 'if_required',
    });

    if (error) {
      setMessage(error.message || "An unexpected error occurred during payment.");
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        await api.confirmRegistration({
          ...registrationDetails,
          paymentIntentId: paymentIntent.id,
        });

        // Registration confirmed, now log the user in
        await login(registrationDetails.email, registrationDetails.password);
        navigate('/dashboard');

      } catch (apiError: any) {
        setMessage(apiError.message || 'Failed to finalize registration after payment.');
        setIsLoading(false);
      }
    } else {
        setMessage('Payment was not successful. Please try again.');
        setIsLoading(false);
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button disabled={isLoading || !stripe || !elements} id="submit" className="w-full !rounded-full !text-lg" isLoading={isLoading}>
        <span id="button-text">
          {t('signupPage.paymentModal.button')}
        </span>
      </Button>
      {message && <div id="payment-message" className="text-sm text-error">{message}</div>}
    </form>
  );
};


interface StripeWrapperProps {
  clientSecret: string;
  registrationDetails: any;
}

export const StripePaymentForm: React.FC<StripeWrapperProps> = ({ clientSecret, registrationDetails }) => {
  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#A755F7',
        colorBackground: '#1C1C1C',
        colorText: '#FFFFFF',
        colorDanger: '#EF4444',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '9999px',
      },
    },
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm registrationDetails={registrationDetails} />
    </Elements>
  );
};
