import { Box, Stack, useToast } from '@chakra-ui/core';
import { PreTitle, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { createTag } from '../inbox.service';
import { InboxTag } from '../inbox.types';
import { PageBack, TagForm } from './component';

export const InboxSettingsNewTag = () => {
  const history = useHistory();
  const toast = useToast();
  const queryClient = useQueryClient();

  const handleGotoTags = () => history.push('/s/inbox/settings/tags');

  const { isLoading, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: Partial<InboxTag>) => createTag(payload),
    {
      onMutate: async data => {
        await queryClient.cancelQueries('tags');
        const previousTags = queryClient.getQueryData('tags');
        //@ts-ignore
        queryClient.setQueryData('tags', old => [...old, data]);
        return { previousTags };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Tag created successfully" />
          ),
        });
        handleGotoTags();
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData('tags', context.previousTags);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleCreateTag = (values: Partial<InboxTag>) => {
    mutate(values);
  };

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <PageBack title="Back to Tags" />
      <Box maxW="800px">
        <Stack spacing="7rem" flex={1} isInline>
          <PreTitle color="black">create tag</PreTitle>
          <Box flex={1}>
            <TagForm isLoading={isLoading} onSubmit={handleCreateTag} onCancel={handleGotoTags} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
