import { Icon, ModalBody, ModalCloseButton, PseudoBox, Stack } from '@chakra-ui/core';
import { requestAccessUrls } from 'app/authenticated-app/channels/channels.data';
import {
  Button,
  Heading2,
  ModalContainer,
  ModalContainerOptions,
  PreTitle,
  XSmallText,
} from 'app/components';
import React from 'react';

export type WhatsappSetupModalProps = ModalContainerOptions & {
  onOpenQrCodeModal?(): void;
};

export const WhatsappSetupModal = (props: WhatsappSetupModalProps) => {
  const { isOpen, onClose, onOpenQrCodeModal } = props;

  const handleOpenWhatsappRequest = () => {
    window.open(requestAccessUrls.whatsapp, '_blank');
  };

  return (
    <ModalContainer size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalCloseButton size="sm" />
      <ModalBody>
        <Stack color="brandBlack" alignItems="center" paddingTop="2rem" justifyContent="center">
          <Heading2 pb="2rem" mb="0" fontSize="1.8rem" color="gray.900">
            Choose your preferred setup
          </Heading2>

          <Stack pb="2rem" isInline spacing="1.5rem">
            <PseudoBox
              pt="1rem"
              pb="2rem"
              px="1.5rem"
              maxW="280px"
              rounded="1rem"
              display="flex"
              textAlign="center"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
            >
              <Icon name="mirror" size="8rem" />
              <PreTitle pb="1.5rem" color="gray.900" fontSize="0.875rem">
                Mirror Current WhatsApp
              </PreTitle>
              <XSmallText pb="1.5rem" color="gray.500">
                Use your existing WhatsApp number. Sync your contacts and groups directly into
                Simpu.
              </XSmallText>
              <Button
                size="sm"
                isFullWidth
                variantColor="blue"
                onClick={() => {
                  onClose?.();
                  onOpenQrCodeModal?.();
                }}
              >
                Continue
              </Button>
            </PseudoBox>

            <PseudoBox
              pt="1rem"
              pb="2rem"
              px="1.5rem"
              maxW="280px"
              rounded="1rem"
              display="flex"
              textAlign="center"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              boxShadow="0px 5px 20px rgba(21, 27, 38, 0.08)"
            >
              <Icon name="request" size="8rem" />
              <PreTitle color="gray.900" pb="1.5rem" fontSize="0.875rem">
                Setup New WhatsApp Business
              </PreTitle>
              <XSmallText pb="1.5rem" color="gray.500">
                Get your personalized WhatsApp for Business Number. Perfect for large enterprises
                and brands.
              </XSmallText>
              <Button size="sm" isFullWidth variantColor="blue" onClick={handleOpenWhatsappRequest}>
                Continue
              </Button>
            </PseudoBox>
          </Stack>
        </Stack>
      </ModalBody>
    </ModalContainer>
  );
};
