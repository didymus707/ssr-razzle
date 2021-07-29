import { Box, Stack, useToast } from '@chakra-ui/core';
import { FullPageSpinner, PreTitle, ToastBox } from 'app/components';
import { AxiosError } from 'axios';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { deleteTag, editTag, getTag } from '../inbox.service';
import { InboxTag } from '../inbox.types';
import { PageBack, TagForm } from './component';

export const InboxSettingsEditTag = () => {
  const { id } = useParams<{ id: string }>();

  const toast = useToast();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery('tag', () => getTag(id));

  const handleGotoTags = () => history.push('/s/inbox/settings/tags');

  const { isLoading: isEditing, mutate } = useMutation<any, AxiosError, any, any>(
    (payload: { id: string; data: InboxTag }) => editTag(payload),
    {
      onMutate: async payload => {
        const { id, data } = payload;
        await queryClient.cancelQueries('tags');
        const previousTags = queryClient.getQueryData('tags');
        queryClient.setQueryData('tags', old => {
          //@ts-ignore
          return old?.map(item => {
            if (item.uuid === id) {
              return data;
            }
            return item;
          });
        });
        return { previousTags };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Tag updated successfully" />
          ),
        });
        queryClient.invalidateQueries('tags');
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

  const { isLoading: isDeleting, mutate: mutateTagDelete } = useMutation<any, AxiosError, any, any>(
    (payload: Partial<InboxTag>) => deleteTag(payload),
    {
      onMutate: async payload => {
        await queryClient.cancelQueries('tags');
        const previousTags = queryClient.getQueryData('tags');
        queryClient.setQueryData('tags', old => {
          //@ts-ignore
          return old?.filter(item => item.uuid !== payload.uuid);
        });
        return { previousTags };
      },
      onSuccess: () => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Tag deleted successfully" />
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

  const handleEditTag = (values: Partial<InboxTag>) => {
    mutate({ id: values.uuid, data: values });
  };

  const handleDeleteTag = () => {
    mutateTagDelete(data.data.tag);
  };

  return (
    <Box height="100%" bg="white" overflowY="auto">
      <PageBack title="Back to Tags" />
      {isLoading ? (
        <FullPageSpinner />
      ) : (
        <Box maxW="800px">
          <Stack spacing="7rem" flex={1} isInline>
            <PreTitle color="black">edit tag</PreTitle>
            <Box flex={1}>
              <TagForm
                isLoading={isEditing}
                isDeleting={isDeleting}
                onSubmit={handleEditTag}
                onCancel={handleGotoTags}
                onDelete={handleDeleteTag}
                initialValues={data.data.tag}
              />
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
