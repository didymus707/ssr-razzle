import { Box, Skeleton, Stack, useToast } from '@chakra-ui/core';
import { ConfirmModal, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router';
import { deleteTag, getTags } from '../inbox.service';
import { InboxTag } from '../inbox.types';
import { InboxSettingsPage, InboxSettingsPageItem } from './component';

export const InboxSettingsTags = () => {
  const toast = useToast();
  const match = useRouteMatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { isLoading, data: tags } = useQuery('tags', getTags);

  const [tagToDelete, setTagToDelete] = useState<InboxTag | undefined>();

  const { isLoading: isDeleting, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: Partial<InboxTag>) => deleteTag(payload),
    {
      onMutate: async payload => {
        await queryClient.cancelQueries('tags');
        const previousTags = queryClient.getQueryData('tags');
        queryClient.setQueryData('tags', old =>
          //@ts-ignore
          old?.filter(item => item.uuid !== payload.uuid),
        );
        return { previousTags };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Tag deleted successfully" />
          ),
        });
        setTagToDelete(undefined);
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

  const handleDeleteTag = () => {
    if (tagToDelete) {
      mutate(tagToDelete);
    }
  };

  return (
    <InboxSettingsPage
      maxW="600px"
      title="Tags"
      helperAlert={{
        title: 'Tags',
        caption:
          'Tags are labels to help you keep track of conversations related to a given topic. Team tags are visible to everyone on your team. In analytics, admins can create reports based on tags. You can click on the tag icon at the top of a conversation to apply a tag.',
      }}
      createAction={{
        label: 'Create a tag',
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
          {tags?.map((tag: InboxTag) => (
            <Box key={tag.uuid}>
              <InboxSettingsPageItem
                heading={tag.name}
                onDelete={() => setTagToDelete(tag)}
                iconProps={{ name: 'inbox-tag', color: tag.color }}
                onClick={() => history.push(`${match.path}/${tag.uuid}`)}
              />
            </Box>
          ))}
        </Stack>
      )}
      <ConfirmModal
        title="Delete Tag"
        isOpen={!!tagToDelete}
        isLoading={isDeleting}
        onConfirm={handleDeleteTag}
        onClose={() => setTagToDelete(undefined)}
      />
    </InboxSettingsPage>
  );
};
