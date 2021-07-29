import { Box, Skeleton, Stack, useDisclosure, useToast } from '@chakra-ui/core';
import { ConfirmModal, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { deleteInboxConnection, getInboxConnections } from '../inbox.service';
import { InboxConnection } from '../inbox.types';
import { ConnectionModal, InboxSettingsPage, InboxSettingsPageItem } from './component';

export const InboxSettingsConnections = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const {
    isOpen: isConnectionModalOpen,
    onOpen: onOpenConnectionModal,
    onClose: onCloseConnectionModal,
  } = useDisclosure();

  const { isLoading, data: connections } = useQuery('inbox-connections', getInboxConnections);

  const [connectionToDelete, setConnectionToDelete] = useState<InboxConnection | undefined>();

  const { isLoading: isDeleting, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: InboxConnection) => deleteInboxConnection(payload.id),
    {
      onMutate: async payload => {
        await queryClient.cancelQueries('inbox-connections');
        const previousConnections = queryClient.getQueryData('inbox-connections');
        queryClient.setQueryData('inbox-connections', old =>
          //@ts-ignore
          old?.filter(item => item.id !== payload.id),
        );
        return { previousConnections };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Connection deleted successfully"
            />
          ),
        });
        setConnectionToDelete(undefined);
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData('inbox-connections', context.previousConnections);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleDeleteConnection = () => {
    if (connectionToDelete) {
      mutate(connectionToDelete);
    }
  };

  return (
    <InboxSettingsPage
      maxW="600px"
      title="Connections"
      helperAlert={{
        title: 'Connections',
        caption:
          'Connections in Simpu Inbox help you integrate your lists and segments into your Inbox. Simpu data - Inbox connections makes available quick information you need ',
      }}
      createAction={
        connections?.length !== 2
          ? {
              label: 'Create a connection',
              onClick: onOpenConnectionModal,
            }
          : undefined
      }
    >
      {isLoading ? (
        <Stack spacing="0">
          {Array.from({ length: 5 }, (v, i) => (
            <Stack
              isInline
              py="0.5rem"
              px="0.75rem"
              borderBottomWidth="1px"
              key={`${i.toString()}-${new Date().getTime()}`}
            >
              <Skeleton height="50px" width="50px" rounded="50%" />
              <Stack flex={1}>
                <Skeleton height="8px" width="50%" my="8px" />
                <Skeleton height="8px" my="8px" />
              </Stack>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Stack spacing="0">
          {connections?.map((connection: InboxConnection) => (
            <Box key={connection.id}>
              <InboxSettingsPageItem
                iconProps={{ name: 'inbox-tag' }}
                onDelete={() => setConnectionToDelete(connection)}
                heading={connection.table_name ?? connection.data_model_name ?? ''}
              />
            </Box>
          ))}
        </Stack>
      )}
      <ConfirmModal
        isLoading={isDeleting}
        title="Delete Connection"
        isOpen={!!connectionToDelete}
        onConfirm={handleDeleteConnection}
        onClose={() => setConnectionToDelete(undefined)}
      />
      <ConnectionModal
        connections={connections}
        isOpen={isConnectionModalOpen}
        onClose={onCloseConnectionModal}
      />
    </InboxSettingsPage>
  );
};
