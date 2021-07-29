import { useToast } from '@chakra-ui/core';
import * as React from 'react';
import { useNetwork } from '../../../hooks';
import { ToastBox } from '../ToastBox';

export function NetworkStatus({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const isOnline = useNetwork();
  if (!isOnline) {
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          onClose={onClose}
          message="No internet connection. Please check your internet connection"
        />
      ),
    });
  }
  return <>{children}</>;
}
