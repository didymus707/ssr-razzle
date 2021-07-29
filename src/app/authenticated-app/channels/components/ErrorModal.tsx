import {
  Box,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/core';
import { Button } from 'app/components';
import React from 'react';
import { ErrorModalProps } from '../channels.types';

export function ErrorModal({ isOpen, setIsOpen, title, description }: ErrorModalProps) {
  return (
    <Modal isCentered isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <ModalOverlay />
      <ModalContent backgroundColor="white" paddingBottom="1.5rem">
        <ModalCloseButton size="sm" color="#fff" />

        <ModalBody padding="0" textAlign="center">
          <Box backgroundColor="red.500" paddingY="1rem">
            <Icon name="warning-2" size="5rem" color="#fff" />
            <Text color="#fff" marginTop=".5rem" fontWeight="bold">
              {title}
            </Text>
          </Box>

          <Text padding="2rem 1rem">{description}</Text>

          <Button variant="solid" variantColor="blue" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
