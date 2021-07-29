import { Box, Skeleton, Stack, useToast } from '@chakra-ui/core';
import { ConfirmModal, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { deleteSignatures, getSignatures } from '../inbox.service';
import { SignatureSchema } from '../inbox.types';
import { InboxSettingsPage, InboxSettingsPageItem } from './component';

export const InboxSettingsSignatures = () => {
  const toast = useToast();
  const history = useHistory();
  const match = useRouteMatch();
  const queryClient = useQueryClient();

  const [page] = useState(1);
  const [signatureToDelete, setSignatureToDelete] = useState<SignatureSchema | undefined>();

  const { isLoading, data } = useQuery(['signatures', page], () => getSignatures({ page }));

  const { isLoading: isDeleting, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: Partial<SignatureSchema>) => deleteSignatures({ ids: [payload.uuid ?? ''] }),
    {
      onMutate: async payload => {
        await queryClient.cancelQueries(['signatures', page]);
        const previousSignatures = queryClient.getQueryData(['signatures', page]);
        queryClient.setQueryData(['signatures', page], old => ({
          //@ts-ignore
          ...old,
          //@ts-ignore
          signatures: old?.signatures?.filter(item => item.uuid !== payload.uuid),
        }));
        return { previousSignatures };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Signature deleted successfully" />
          ),
        });
        setSignatureToDelete(undefined);
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData(['signatures', page], context.previousSignatures);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleDeleteSignature = () => {
    if (signatureToDelete) {
      mutate(signatureToDelete);
    }
  };

  return (
    <InboxSettingsPage
      maxW="600px"
      title="Signatures"
      helperAlert={{
        title: 'Signatures',
        caption:
          'An email signature is used to provide the recipient with your name, email address, business contact information It creates a cohesive image throughout your company and shows that your business is well established. You can change the default signature by upgrading to enterprise plan.',
      }}
      createAction={{
        label: 'Create a signature',
        onClick: () => history.push(`${match.path}/new`),
      }}
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
          {data?.signatures?.map((signature: SignatureSchema) => (
            <Box key={signature.uuid}>
              <InboxSettingsPageItem
                heading={signature.content}
                showDeleteButton={!signature.is_default}
                onDelete={() => setSignatureToDelete(signature)}
                iconProps={{ name: 'inbox-signature', color: 'gray.900' }}
                onClick={() => history.push(`${match.path}/${signature.uuid}`)}
              />
            </Box>
          ))}
        </Stack>
      )}
      <ConfirmModal
        isLoading={isDeleting}
        isOpen={!!signatureToDelete}
        title="Delete Signature"
        onConfirm={handleDeleteSignature}
        onClose={() => setSignatureToDelete(undefined)}
      />
    </InboxSettingsPage>
  );
};
