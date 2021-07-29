import { BoxProps, Flex, Icon, IconButton, Stack, Text } from '@chakra-ui/core';
import React from 'react';

type ToastOptions = {
  bg?: string;
  color?: string;
  icon?: string;
};

type ToastStatus = 'success' | 'error' | 'info';

export type ToastBoxProps = { message?: string; status?: ToastStatus; onClose?(): void } & BoxProps;

export function ToastBox({ message, onClose, status = 'error' }: ToastBoxProps) {
  const toastOptions = {
    error: {
      bg: '#FAE7E7',
      color: '#DA1414',
      icon: 'alert-error',
    },
    success: {
      bg: '#ECEAF9',
      color: '#6155EB',
      icon: 'alert-success',
    },
    info: {
      bg: '#ECEAF9',
      color: '#6155EB',
      icon: 'alert-info',
    },
  } as { [key in ToastStatus]: ToastOptions };

  const { bg, color, icon } = toastOptions[status];

  return (
    <Flex m={3} p={3} bg={bg} rounded="8px" alignItems="center" justifyContent="space-between">
      <Stack isInline alignItems="center">
        <Icon size="1.5rem" name={icon} color={color} />
        <Text color={color}>{message}</Text>
      </Stack>
      <IconButton
        ml="4rem"
        size="xs"
        icon="close"
        onClick={onClose}
        variant="unstyled"
        aria-label="close toast"
        _focus={{ boxShadow: 'none' }}
      />
    </Flex>
  );
}
