import { Box, Stack, useToast } from '@chakra-ui/core';
import { FullPageSpinner, PreTitle, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { deleteQuickReplies, getQuickReply, updateQuickReply } from '../inbox.service';
import { QuickReplySchema } from '../inbox.types';
import { PageBack, QuickReplyForm } from './component';

export const InboxSettingsEditQuickReply = () => {
  const { id } = useParams<{ id: string }>();

  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<QuickReplySchema, any>(['quick-reply', id], () =>
    getQuickReply(id),
  );

  const handleGoBack = () => history.push('/s/inbox/settings/quick-replies');

  const { isLoading: isEditing, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: { id: string; name: string; subject?: string; content: string }) =>
      updateQuickReply(payload.id, payload),
    {
      onMutate: async payload => {
        const { id, name, subject, content } = payload;
        const newReply = {
          id,
          name,
          template: {
            subject,
            content,
          },
        };
        await queryClient.cancelQueries(['quick-reply', id]);
        const previousReply = queryClient.getQueryData(['quick-reply', id]);
        queryClient.setQueryData(['quick-reply', id], newReply);
        return { previousReply, newReply };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Quick reply updated successfully"
            />
          ),
        });
        queryClient.invalidateQueries(['quick-replies', 1]);
        handleGoBack();
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData(['quick-reply', id], context.previousReply);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const { isLoading: isDeleting, mutate: mutateQuickReplyDelete } = useMutation<
    any,
    AxiosError,
    any,
    any
  >((payload: QuickReplySchema) => deleteQuickReplies({ ids: [payload.uuid] }), {
    onMutate: async payload => {
      await queryClient.cancelQueries(['quick-replies', 1]);
      const previousReplies = queryClient.getQueryData(['quick-replies', 1]);
      queryClient.setQueryData(['quick-replies', 1], old => ({
        //@ts-ignore
        ...old,
        //@ts-ignore
        quick_replies: old?.quick_replies.filter(item => item.uuid !== payload.uuid),
      }));
      return { previousReplies };
    },
    onSuccess: () => {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Quick reply deleted successfully" />
        ),
      });
      handleGoBack();
    },
    onError: (error, newData, context) => {
      queryClient.setQueryData('quick-replies', context.previousReplies);

      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
      });
    },
  });

  const handleEditReply = (values: {
    id?: string;
    name: string;
    subject?: string;
    content?: EditorState;
  }) => {
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

  const handleDeleteReply = () => {
    mutateQuickReplyDelete(data);
  };

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <PageBack title="Back to Quick Replies" />
      {isLoading ? (
        <FullPageSpinner />
      ) : (
        <Box maxW="800px">
          <Stack spacing="7rem" flex={1} isInline>
            <PreTitle color="black">edit quick reply</PreTitle>
            <Box flex={1}>
              <QuickReplyForm
                isLoading={isEditing}
                isDeleting={isDeleting}
                initialValues={{
                  id,
                  name: data?.name ?? '',
                  subject: data?.template.subject,
                  content: data?.template.content,
                }}
                onCancel={handleGoBack}
                onSubmit={handleEditReply}
                onDelete={handleDeleteReply}
              />
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
