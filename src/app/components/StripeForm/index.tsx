import { useToast, ButtonProps, Box } from '@chakra-ui/core';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentMethod, StripeCardElement, StripeError } from '@stripe/stripe-js';
import React from 'react';
import { Button } from '../Button';
import { ToastBox } from '../ToastBox';

type StripeFormProps = {
  buttonText?: string;
  onError?: (error?: StripeError) => void;
  onSuccess?: (paymentMethod?: PaymentMethod) => void;
} & Omit<ButtonProps, 'children'>;

export const StripeForm = ({
  onSuccess,
  onError,
  buttonText = 'Pay',
  ...rest
}: StripeFormProps) => {
  const toast = useToast();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    // Block native form submission.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const cardElement = elements.getElement(CardElement) as StripeCardElement;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      onError && onError(error);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    } else {
      onSuccess && onSuccess(paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box my="1rem">
        <CardElement />
      </Box>
      {stripe && (
        <Button type="submit" variantColor="blue" isDisabled={!stripe} {...rest}>
          {buttonText}
        </Button>
      )}
    </form>
  );
};
