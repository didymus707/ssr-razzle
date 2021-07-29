import { Box, Stack, useToast } from '@chakra-ui/core';
import { FullPageSpinner, PreTitle, ToastBox } from 'app/components';
import React from 'react';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { deleteSignatures, getSignature, updateSignature } from '../inbox.service';
import { SignatureSchema } from '../inbox.types';
import { PageBack, SignatureForm } from './component';
import { AxiosError } from 'axios';

export const InboxSettingsEditSignature = () => {
  const { id } = useParams<{ id: string }>();

  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleGoBack = () => history.push('/s/inbox/settings/signatures');

  const { data, isLoading } = useQuery<SignatureSchema, any>(['signature', id], () =>
    getSignature(id),
  );

  const { isLoading: isEditing, mutate } = useMutation<any, AxiosError, any, any>(
    ({ id, content }: { id: string; content: string }) => updateSignature(id, { content }),
    {
      onMutate: async newSignature => {
        await queryClient.cancelQueries(['signature', newSignature.id]);
        const previousSignature = queryClient.getQueryData(['signature', newSignature.id]);
        queryClient.setQueryData(['signature', newSignature.id], newSignature);
        return { previousSignature, newSignature };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Signature updated successfully" />
          ),
        });
        handleGoBack();
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData(['signatures', id], context.previousSignature);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const { isLoading: isDeleting, mutate: mutateSignatureDelete } = useMutation<
    any,
    AxiosError,
    any,
    any
  >((payload: SignatureSchema) => deleteSignatures({ ids: [payload.uuid] }), {
    onMutate: async payload => {
      await queryClient.cancelQueries(['signatures', 1]);
      const previousSignatures = queryClient.getQueryData(['signatures', 1]);
      queryClient.setQueryData(['signatures', 1], old => ({
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
      handleGoBack();
    },
    onError: (error, newData, context) => {
      queryClient.setQueryData('signatures', context.previousSignatures);

      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    },
  });

  const handleEditSignature = (values: { content?: EditorState }) => {
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

  const handleDeleteSignature = () => {
    mutateSignatureDelete(data);
  };

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <PageBack title="Back to Signatures" />
      {isLoading ? (
        <FullPageSpinner />
      ) : (
        <Box maxW="800px">
          <Stack spacing="7rem" flex={1} isInline>
            <PreTitle color="black">edit signature</PreTitle>
            <Box flex={1}>
              <SignatureForm
                isLoading={isEditing}
                isDeleting={isDeleting}
                onCancel={handleGoBack}
                onSubmit={handleEditSignature}
                onDelete={handleDeleteSignature}
                initialValues={{ id: data?.uuid, content: data?.content }}
              />
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
