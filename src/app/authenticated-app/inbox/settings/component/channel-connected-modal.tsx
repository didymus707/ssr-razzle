import { Box, Button, Icon, ModalBody, ModalCloseButton, PseudoBox, Stack } from '@chakra-ui/core';
import {
  Heading2,
  ModalContainer,
  ModalContainerOptions,
  PreTitle,
  XSmallText,
} from 'app/components';
import React from 'react';
import { useHistory } from 'react-router';

export type ChannelConnectedModalProps = ModalContainerOptions & {
  channel: string;
};

export const ChannelConnectedModal = (props: ChannelConnectedModalProps) => {
  const { isOpen, onClose, channel } = props;
  const history = useHistory();

  const handleDiscoverInbox = () => {
    onClose?.();
    history.push('/s/inbox');
  };

  const handleConnectMoreChannels = () => {
    onClose?.();
    history.push(`/s/inbox/settings/channels/${channel}`);
  };

  return (
    <ModalContainer size="2xl" isOpen={isOpen} onClose={onClose}>
      <ModalCloseButton size="sm" />
      <ModalBody>
        <Stack color="brandBlack" alignItems="center" paddingTop="2rem" justifyContent="center">
          <Box pb="2rem">
            <Heading2 textAlign="center" pb="0.5rem" mb="0" fontSize="1.8rem" color="gray.900">
              You are connected!
            </Heading2>
            <Heading2 textAlign="center" mb="0" fontSize="1.8rem" color="gray.900">
              How would you like to start?
            </Heading2>
          </Box>

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
                Discover your inbox
              </PreTitle>
              <XSmallText pb="1.5rem" color="gray.500">
                Use your existing WhatsApp number. Sync your contacts and groups directly into
                Simpu.
              </XSmallText>
              <Button size="sm" isFullWidth variantColor="blue" onClick={handleDiscoverInbox}>
                Start with inbox
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
                Connect more channels
              </PreTitle>
              <XSmallText pb="1.5rem" color="gray.500">
                Get your personalized WhatsApp for Business Number. Perfect for large enterprises
                and brands.
              </XSmallText>
              <Button size="sm" isFullWidth variantColor="blue" onClick={handleConnectMoreChannels}>
                Continue
              </Button>
            </PseudoBox>
          </Stack>
        </Stack>
      </ModalBody>
    </ModalContainer>
  );
};
