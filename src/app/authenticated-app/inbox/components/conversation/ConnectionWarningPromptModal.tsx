import { Box, ModalBody, Stack, useToast } from '@chakra-ui/core';
import {
  BodyText,
  Button,
  ModalContainer,
  ModalContainerOptions,
  SmallText,
  ToastBox,
} from 'app/components';
import React, { useState } from 'react';
import { prompts } from '../..';
import { useHere as onUseCredentialHere } from 'app/authenticated-app/channels';
import { UserChannelSchema } from '../../inbox.types';
import { useInbox } from '../Provider';
import { ConnectionWarningPromptProps } from './ConnectionWarningPrompt';

export type ConnectionWarningPromptModalProps = ModalContainerOptions & {
  credentialsWithIssue: ConnectionWarningPromptProps['credentialsWithIssue'];
};

export const ConnectionWarningPromptModal = (props: ConnectionWarningPromptModalProps) => {
  const { isOpen, onClose, credentialsWithIssue } = props;

  return (
    <ModalContainer title="Whatsapp connection errors" size="sm" isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <SmallText pb="1.5rem" color="gray.500">
          One or more of your whatsapp accounts have been disconnected
        </SmallText>
        {credentialsWithIssue?.map(channel => (
          <PromptItem channel={channel} />
        ))}
      </ModalBody>
    </ModalContainer>
  );
};

const PromptItem = (props: { channel: UserChannelSchema }) => {
  const { channel } = props;
  const { status, user, uuid } = channel;
  const { platform_name, platform_nick } = user;
  const { text = '', btn = '' } = prompts[status] || {};

  const [isConnecting, setIsConnecting] = useState(false);

  const toast = useToast();
  const { onOpenWhatsappModal, setQrCodeChannelId } = useInbox();

  let onClick = undefined;

  const handleUseHere = async () => {
    try {
      setIsConnecting(true);
      await onUseCredentialHere({ credentialID: uuid });
      setIsConnecting(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Channel reconnection successful" />
        ),
      });
    } catch (error) {
      setIsConnecting(false);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    }
  };

  switch (status) {
    case 'replaced':
      onClick = handleUseHere;
      break;
    case 'invalid_token':
      onClick = () => {
        setQrCodeChannelId(user.channel_id);
        onOpenWhatsappModal();
      };
      break;
    default:
      onClick = undefined;
      break;
  }

  return (
    <Stack pb="1.5rem" isInline justifyContent="space-between">
      <Box flex={1}>
        <BodyText color="gray.900">{platform_name ?? platform_nick}</BodyText>
        <SmallText color="gray.500">{text}</SmallText>
      </Box>
      {btn && (
        <Button
          size="sm"
          width="120px"
          onClick={onClick}
          variantColor="blue"
          isLoading={isConnecting}
        >
          {btn}
        </Button>
      )}
    </Stack>
  );
};
