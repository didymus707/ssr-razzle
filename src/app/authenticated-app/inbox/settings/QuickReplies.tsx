import { Box, Skeleton, Stack, useToast } from '@chakra-ui/core';
import { ConfirmModal, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { deleteQuickReplies, getQuickReplies } from '../inbox.service';
import { QuickReplySchema } from '../inbox.types';
import { InboxSettingsPage, InboxSettingsPageItem } from './component';

export const InboxSettingsQuickReplies = () => {
  const toast = useToast();
  const match = useRouteMatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const [page] = React.useState(1);
  const [replyToDelete, setReplyToDelete] = useState<QuickReplySchema | undefined>();

  const { isLoading, data } = useQuery(['quick-replies', page], () => getQuickReplies({ page }));

  const { isLoading: isDeleting, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: Partial<QuickReplySchema>) => deleteQuickReplies({ ids: [payload.uuid ?? ''] }),
    {
      onMutate: async payload => {
        await queryClient.cancelQueries(['quick-replies', page]);
        //@ts-ignore
        const previousQuickReplies = queryClient.getQueryData(['quick-replies', page]);
        queryClient.setQueryData(['quick-replies', page], old => ({
          //@ts-ignore
          ...old,
          //@ts-ignore
          quick_replies: old?.quick_replies.filter(item => item.uuid !== payload.uuid),
        }));
        return { previousQuickReplies };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Quick reply deleted successfully"
            />
          ),
        });
        setReplyToDelete(undefined);
        queryClient.invalidateQueries(['quick-replies', page]);
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData(['quick-replies', page], context.previousQuickReplies);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const handleDeleteQuickReply = () => {
    if (replyToDelete) {
      mutate(replyToDelete);
    }
  };

  return (
    <InboxSettingsPage
      maxW="600px"
      title="Quick Replies"
      helperAlert={{
        title: 'Quick replies',
        caption:
          'You can use quick replies to quickly respond to conversations. You can use variables in your quick replies to fill the dynamic content, such as recipients name.',
      }}
      createAction={{
        label: 'Create a quick reply',
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
          {data?.quick_replies?.map((reply: QuickReplySchema) => (
            <Box key={reply.uuid}>
              <InboxSettingsPageItem
                heading={reply.name}
                onDelete={() => setReplyToDelete(reply)}
                onClick={() => history.push(`${match.path}/${reply.uuid}`)}
                iconProps={{ name: 'inbox-compose-quote', color: 'gray.900' }}
              />
            </Box>
          ))}
        </Stack>
      )}
      <ConfirmModal
        isLoading={isDeleting}
        isOpen={!!replyToDelete}
        title="Delete Quick Reply"
        onConfirm={handleDeleteQuickReply}
        onClose={() => setReplyToDelete(undefined)}
      />
    </InboxSettingsPage>
  );
};
