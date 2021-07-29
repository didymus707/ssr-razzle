import {
  Box,
  BoxProps,
  Icon,
  ModalCloseButton,
  Stack,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { useHere as onUseCredentialHere } from 'app/authenticated-app/channels';
import { BodyText, Button, ToastBox, XSmallText } from 'app/components';
import React, { useState } from 'react';
import { prompts } from '../../inbox.data';
import { UserChannelSchema } from '../../inbox.types';
import { useInbox } from '../Provider';
import { ConnectionWarningPromptModal } from './ConnectionWarningPromptModal';

export type ConnectionWarningPromptProps = {
  credentialsWithIssue?: UserChannelSchema[];
};

export function ConnectionWarningPrompt({ credentialsWithIssue }: ConnectionWarningPromptProps) {
  const toast = useToast();
  const { onOpenWhatsappModal, setQrCodeChannelId } = useInbox();
  const {
    isOpen: isConnectionWarningModalOpen,
    onOpen: onOpenConnectionWarningModal,
    onClose: onCloseConnectionWarningModal,
  } = useDisclosure();

  const { isOpen: isAlertOpen, onClose: onCloseAlert } = useDisclosure(
    !credentialsWithIssue || credentialsWithIssue?.length !== 0,
  );

  const [isConnecting, setIsConnecting] = useState(false);

  if (!credentialsWithIssue || credentialsWithIssue?.length === 0) {
    return null;
  }

  if (credentialsWithIssue?.length === 1) {
    const [{ status, uuid, user }] = credentialsWithIssue;
    const { text = '', btn = '', title = '' } = prompts[status] || {};

    let onClick = undefined;

    const handleUseHere = async () => {
      try {
        setIsConnecting(true);
        await onUseCredentialHere({ credentialID: uuid });
        setIsConnecting(false);
        onCloseAlert();
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Channel reconnection successful"
            />
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
      <Container isOpen={isAlertOpen} onClose={onCloseAlert}>
        <Stack isInline spacing="1.125rem">
          <Icon size="1.5rem" color="#D84910" name="alert-error" />
          <Box>
            <BodyText color="#D84910">{title}</BodyText>
            <XSmallText color="#D84910" opacity={0.6}>
              {text}
            </XSmallText>
            {btn && (
              <Button
                px="0"
                size="sm"
                variant="link"
                color="#D84910"
                onClick={onClick}
                isLoading={isConnecting}
                textDecoration="underline"
              >
                {btn}
              </Button>
            )}
          </Box>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Container
        padding=".875rem"
        fontSize=".875rem"
        isOpen={isAlertOpen}
        onClose={onCloseAlert}
        lineHeight="1.1875rem"
      >
        <Stack isInline spacing="1.125rem">
          <Icon size="1.5rem" color="#D84910" name="alert-error" />
          <Box>
            <BodyText color="#D84910">Whatsapp Connection Errors</BodyText>
            <XSmallText color="#D84910" opacity={0.6}>
              One or more of your whatsapp accounts have been disconnected
            </XSmallText>
            <Button
              px="0"
              size="sm"
              variant="link"
              color="#D84910"
              textDecoration="underline"
              onClick={onOpenConnectionWarningModal}
            >
              Connect now
            </Button>
          </Box>
        </Stack>
      </Container>
      <ConnectionWarningPromptModal
        isOpen={isConnectionWarningModalOpen}
        onClose={onCloseConnectionWarningModal}
        credentialsWithIssue={credentialsWithIssue}
      />
    </>
  );
}

const Container = ({
  isOpen,
  onClose,
  children,
  ...rest
}: BoxProps & { isOpen?: boolean; onClose?(): void }) => {
  return isOpen ? (
    <Box
      mb="1rem"
      px="1rem"
      bg="#F8E9E3"
      py="0.875rem"
      rounded="0.5rem"
      position="relative"
      {...rest}
    >
      {children}
      <ModalCloseButton size="sm" onClick={onClose} />
    </Box>
  ) : null;
};
