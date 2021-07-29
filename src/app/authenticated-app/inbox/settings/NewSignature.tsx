import { Box, Stack, useToast } from '@chakra-ui/core';
import { PreTitle, ToastBox } from 'app/components';
import React from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useHistory } from 'react-router';
import { useMutation, useQueryClient } from 'react-query';
import { PageBack, SignatureForm } from './component';
import { AxiosError } from 'axios';
import { createSignature } from '../inbox.service';

export const InboxSettingsNewSignature = () => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleGoBack = () => history.push('/s/inbox/settings/signatures');

  const { isLoading, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: { content: string }) => createSignature(payload),
    {
      onMutate: async data => {
        const { content } = data;
        const newData = {
          content,
        };
        await queryClient.cancelQueries(['signatures', 1]);
        const previousSignatures = queryClient.getQueryData(['signatures', 1]);
        queryClient.setQueryData(['signatures', 1], old => ({
          //@ts-ignore
          ...old,
          //@ts-ignore
          signatures: [...old.signatures, newData],
        }));
        return { previousSignatures };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Signature created successfully" />
          ),
        });
        handleGoBack();
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData(['signatures', 1], context.previousSignatures);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleCreateSignature = (values: { content?: EditorState }) => {
    const rawContentState = values?.content && convertToRaw(values.content.getCurrentContent());
    const content =
      rawContentState &&
      draftToHtml(rawContentState, {
        trigger: '#',
        separator: ' ',
      });
    const payload = { ...values, content };
    mutate(payload);
  };

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <PageBack title="Back to Signatures" />
      <Box maxW="800px">
        <Stack spacing="7rem" flex={1} isInline>
          <PreTitle color="black">create signature</PreTitle>
          <Box flex={1}>
            <SignatureForm
              isLoading={isLoading}
              onCancel={handleGoBack}
              onSubmit={handleCreateSignature}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
