import { Alert, Box, CloseButton, Heading, Stack, Text } from '@chakra-ui/core';
import React from 'react';
import { NotificationsForm } from './NotificationsForm';

export function Notifications() {
  const [showAlert, setShowAlert] = React.useState(true);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <Box>
      <Heading size="sm" color="#333333" marginBottom="1.5rem" fontWeight="semibold">
        Customise your notifications
      </Heading>
      {showAlert && (
        <Alert marginBottom="1.5rem" flexDirection="column" backgroundColor="#f6fafd">
          <CloseButton position="absolute" right="8px" top="8px" onClick={handleCloseAlert} />

          <Stack isInline width="100%" flexWrap="wrap" alignItems="center" paddingBottom="1rem">
            <Heading fontSize="0.75rem" color="#11111">
              Basic Notifications.
            </Heading>
            <Text fontSize="0.75rem" color="rgba(17,17,17,0.5)">
              Notifications are customizable that keep updated on activites in Simpu.
            </Text>
          </Stack>
          <Stack isInline width="100%" flexWrap="wrap" alignItems="center" paddingBottom="1rem">
            <Heading fontSize="0.75rem" color="#11111">
              All notifications
            </Heading>
            <Text fontSize="0.75rem" color="rgba(17,17,17,0.5)">
              Receive notifications for all new messages and notifications for all conversations I
              have access to.
            </Text>
          </Stack>
          <Stack isInline width="100%" flexWrap="wrap" alignItems="center" paddingBottom="1rem">
            <Heading fontSize="0.75rem" color="#11111">
              Smart notifications
            </Heading>
            <Text fontSize="0.75rem" color="rgba(17,17,17,0.5)">
              Receive a new message, @mention, or if there's an update to the conversation I follow.
            </Text>
          </Stack>
          <Stack isInline width="100%" flexWrap="wrap" alignItems="center" paddingBottom="1rem">
            <Heading fontSize="0.75rem" color="#11111">
              No notifications
            </Heading>
            <Text fontSize="0.75rem" color="rgba(17,17,17,0.5)">
              I don't want to receive any notifications
            </Text>
          </Stack>
        </Alert>
      )}
      <Box maxWidth="450px">
        <NotificationsForm />
      </Box>
    </Box>
  );
}
