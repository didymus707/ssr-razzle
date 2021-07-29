import { ButtonProps } from '@chakra-ui/core';
import * as React from 'react';
import { usePaystackPayment } from 'react-paystack';
import { getReference } from '../../../utils';
import { Button } from '../Button';
import { PaystackProps } from './types';

type PayButtonProps = {
  email?: string;
  amount: number;
  first_name?: string;
  last_name?: string;
  onClose?: () => void;
  callback?: () => void;
} & ButtonProps &
  Omit<PaystackProps, 'publicKey'>;

export function PayButton({
  plan,
  email,
  label,
  phone,
  amount,
  bearer,
  children,
  onClose,
  callback,
  last_name,
  first_name,
  reference,
  metadata,
  currency,
  channels,
  quantity,
  subaccount,
  split_code,
  transaction_charge,
  ...rest
}: PayButtonProps) {
  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const config = {
    plan,
    phone,
    label,
    amount,
    last_name,
    first_name,
    metadata,
    currency,
    channels,
    quantity,
    subaccount,
    email: email ? email : '',
    reference: getReference(),
    publicKey: publicKey || '',
  };
  // @ts-ignore
  const initializePayment = usePaystackPayment(config);

  const handleCallback = () => {
    callback && callback();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <div>
      <Button
        {...rest}
        onClick={() => {
          initializePayment(handleCallback, handleClose);
        }}
      >
        {children}
      </Button>
    </div>
  );
}
