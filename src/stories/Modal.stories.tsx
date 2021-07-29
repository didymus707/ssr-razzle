//@ts-nocheck
import { Button, ConfirmModal } from 'app/components';
import React from 'react';
import { Meta } from '@storybook/react';
import { ConfirmModalProps } from 'app/components/ConfirmModal/types';
import { Text, useDisclosure } from '@chakra-ui/core';

export default {
  title: 'Design System/Modal',
} as Meta;

export const ConfirmationModal = (args: ConfirmModalProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} size="sm">
        Click me
      </Button>
      <ConfirmModal {...{ ...args, title: 'Hello', onClose, isOpen }}>
        <Text>Hello world</Text>
      </ConfirmModal>
    </>
  );
};
