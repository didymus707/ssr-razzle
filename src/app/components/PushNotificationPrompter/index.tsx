import React, { useState, useEffect } from 'react';
import { Flex, Icon, Text, CloseButton, useToast } from '@chakra-ui/core';
import usePushNotifications from './useNotification';
import { ToastBox } from '../ToastBox';
import { Button } from '../Button';

export function PushNotificationPrompter({
  userId = '',
  email = '',
  organizationID = '',
  onToggle,
}: {
  userId?: string;
  organizationID?: string;
  email?: string;
  onToggle: (v: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const {
    error,
    isPushNotificationSupported,
    pushNotificationStatus,
    askPushNotificationPermission,
  } = usePushNotifications(userId, email, organizationID);
  const toast = useToast();

  if (error) {
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
    });
  }

  const toggleStatus =
    isOpen && isPushNotificationSupported && pushNotificationStatus === 'default';

  useEffect(() => {
    onToggle(toggleStatus);
  }, [onToggle, toggleStatus]);

  return toggleStatus ? (
    <Flex
      fontSize=".875rem"
      backgroundColor="yellow.500"
      color="#fff"
      padding="0.3rem 1rem"
      alignItems="center"
    >
      <Icon name="warning-2" />

      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text>Do you want to enable desktop notifications?</Text>

        <Button
          height="auto"
          variant="unstyled"
          fontSize=".875rem"
          marginLeft="1.1rem"
          textDecoration="underline"
          onClick={() => askPushNotificationPermission()}
        >
          Enable
        </Button>

        <Button
          height="auto"
          variant="unstyled"
          fontSize=".875rem"
          marginLeft="1.25rem"
          textDecoration="underline"
          onClick={() => setIsOpen(false)}
        >
          Remind me later
        </Button>
      </Flex>

      <CloseButton size="sm" onClick={() => setIsOpen(false)} />
    </Flex>
  ) : (
    <div />
  );
}
