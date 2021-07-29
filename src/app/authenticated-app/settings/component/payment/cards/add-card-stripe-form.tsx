// @ts-nocheck
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Box, useToast } from '@chakra-ui/core';
import { ToastBox, Button } from '../../../../../components';

const key_secret = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(key_secret);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const CardSetupForm = ({ cancel, initialization, close, profile }) => {
  const [loading, setLoading] = useState();
  const stripe = useStripe();
  const elements = useElements();
  const toast = useToast();

  const handleSubmit = async event => {
    setLoading(true);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardSetup(initialization['provider_code'], {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: `${profile?.first_name} ${profile?.last_name}`,
        },
      },
    });

    if (result.error) {
      setLoading(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Unable to add debit card at the moment, please try again"
          />
        ),
      });
    } else {
      setTimeout(() => {
        setLoading(false);
        close();
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box my="30px">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </Box>
      <Box className="actions">
        <Button
          variantColor="blue"
          className="prompt-button"
          isDisabled={!stripe}
          isLoading={loading}
          type="submit"
        >
          Save Card
        </Button>
        <Button className="prompt-button secondary" variant="ghost" onClick={cancel}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export const AddStripeCardForm = ({ cancel, initialization, close, profile }) => {
  return (
    <Elements stripe={stripePromise}>
      <CardSetupForm
        cancel={cancel}
        initialization={initialization}
        close={close}
        profile={profile}
      />
    </Elements>
  );
};
