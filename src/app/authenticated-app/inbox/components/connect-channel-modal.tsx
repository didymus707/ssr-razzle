import { Flex, Image, ModalBody } from '@chakra-ui/core';
import { BodyText, Button, Heading3, ModalContainer, ModalContainerOptions } from 'app/components';
import React from 'react';
import Cookie from 'js-cookie';
import { useHistory } from 'react-router';
import connectChannelsImage from './connect-channels.svg';

export type ConnectChannelModalProps = ModalContainerOptions;

export const ConnectChannelModal = (props: ConnectChannelModalProps) => {
  const { isOpen, onClose } = props;
  const history = useHistory();

  return (
    <ModalContainer
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalBody>
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Image mb="1.5rem" src={connectChannelsImage} />
          <Heading3 textAlign="center" pb="1.5rem" color="gray.900">
            Connect your channels
          </Heading3>
          <BodyText pb="1.5rem" color="gray.500" textAlign="center">
            You have not connected any channels to your Simpu inbox. Get started by connecting all
            your favourite channels in your inbox settings
          </BodyText>
          <Button
            mb="1.5rem"
            isFullWidth
            variantColor="blue"
            onClick={() => {
              Cookie.set('show_connect_channel_modal', 'false');
              history.push('/s/inbox/settings/channels');
            }}
          >
            Go to settings
          </Button>
        </Flex>
      </ModalBody>
    </ModalContainer>
  );
};
