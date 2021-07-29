// @ts-nocheck
import * as React from 'react';
import {
  Text,
  Stack,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  SlideIn,
} from '@chakra-ui/core';
import { ConfirmModalProps } from './types';
import { Button } from 'app/components';

export function ConfirmModal({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  hidePrompt = false,
  confirmButtonText = 'Yes',
  cancelButtonText = 'No',
}: ConfirmModalProps) {
  return (
    <SlideIn in={isOpen}>
      {(styles: Object) => (
        <Modal isCentered size="sm" isOpen={true} onClose={onClose}>
          <ModalOverlay />
          <ModalContent borderRadius="16px" {...styles}>
            <ModalHeader fontSize="1.5rem" mr={10}>
              {title}
            </ModalHeader>
            <ModalCloseButton size="sm" />
            <ModalBody>
              {!hidePrompt && <Text>Are you sure you want to carry out this action?</Text>}
              {description && (
                <Text fontSize=".875rem" marginTop=".5rem">
                  {description}
                </Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Stack isInline width="100%">
                <Button size="sm" width="48%" variant="outline" onClick={onClose}>
                  {cancelButtonText}
                </Button>
                <Button
                  size="sm"
                  width="48%"
                  variantColor="blue"
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmButtonText}
                </Button>
              </Stack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  );
}
