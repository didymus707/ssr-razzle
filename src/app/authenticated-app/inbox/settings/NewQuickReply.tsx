import { Box, Stack, useToast } from '@chakra-ui/core';
import { PreTitle, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { createQuickReply } from '../inbox.service';
import { PageBack, QuickReplyForm } from './component';

export const InboxSettingsNewQuickReply = () => {
  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const handleGoBack = () => history.push('/s/inbox/settings/quick-replies');

  const { isLoading, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: { name: string; subject?: string; content: string }) => createQuickReply(payload),
    {
      onMutate: async data => {
        const { name, content, subject } = data;
        const newData = {
          name,
          template: {
            content,
            subject,
          },
        };
        await queryClient.cancelQueries(['quick-replies', 1]);
        const previousReplies = queryClient.getQueryData(['quick-replies', 1]);
        queryClient.setQueryData(['quick-replies', 1], old => ({
          //@ts-ignore
          ...old,
          //@ts-ignore
          quick_replies: [...old.quick_replies, newData],
        }));
        return { previousReplies };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Quick reply created successfully"
            />
          ),
        });
        queryClient.invalidateQueries(['quick-replies', 1]);
        handleGoBack();
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData(['quick-replies', 1], context.previousReplies);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleCreateReply = (values: { name: string; subject?: string; content?: EditorState }) => {
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
      <PageBack title="Back to Quick Replies" />
      <Box maxW="800px">
        <Stack spacing="7rem" flex={1} isInline>
          <PreTitle color="black">create quick reply</PreTitle>
          <Box flex={1}>
            <QuickReplyForm
              isLoading={isLoading}
              onCancel={handleGoBack}
              onSubmit={handleCreateReply}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
