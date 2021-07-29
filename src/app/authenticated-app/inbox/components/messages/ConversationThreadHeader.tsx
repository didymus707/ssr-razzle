import {
  Avatar,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  Stack,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/core';
import { TeamMember } from 'app/authenticated-app/settings/settings.types';
import { Button, Subtitle, ToastBox } from 'app/components';
import { selectOrganisationID } from 'app/unauthenticated-app/authentication';
import { AxiosError } from 'axios';
import { formatISO } from 'date-fns';
import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { channelOptions } from '../..';
import {
  addConversationNote,
  assignConversationThread,
  favoriteThread,
  resolveConversationThread,
  tagConversation,
  unFavoriteThread,
  unTagConversation,
} from '../../inbox.service';
import { Channel, InboxTag, NoteSchema, ThreadSchema } from '../../inbox.types';
import { CloseConversationModal, NoteModal } from '../more-info';
import { AssignmentMenu } from './AssignmentMenu';
import { MoreOptionsMenu } from './MoreOptionsMenu';
// import { SnoozeMenu } from './SnoozeMenu';
import { TagsMenu } from './TagsMenu';

export type ConversationThreadHeaderProps = {
  tags?: InboxTag[];
  thread?: ThreadSchema;
  lastMessage?: ThreadSchema['last_message'];
};

export const ConversationThreadHeader = (props: ConversationThreadHeaderProps) => {
  const { tags, lastMessage, thread = {} as ThreadSchema } = props;
  const { uuid, sender = {} as ThreadSchema['sender'], is_favorited } = thread;
  const channel: Channel = sender?.channel_name;

  const toast = useToast();
  const queryClient = useQueryClient();
  const {
    isOpen: isNoteModalOpen,
    onOpen: onOpenNoteModal,
    onClose: onCloseNoteModal,
  } = useDisclosure();
  const {
    isOpen: isCloseConversationModalOpen,
    onOpen: onOpenCloseConversationModal,
    onClose: onCloseCloseConversationModal,
  } = useDisclosure();

  const organizationID = useSelector(selectOrganisationID);

  const [isAssignMenuOpen, setIsAssignMenuOpen] = useState(false);
  const onCloseAssignMenu = () => setIsAssignMenuOpen(false);
  const onOpenAssignMenu = () => setIsAssignMenuOpen(!isAssignMenuOpen);

  const { mutate: favoriteMutate } = useMutation<any, AxiosError, any, any>(
    (thread: ThreadSchema) => favoriteThread(thread),
    {
      onMutate: async newThread => {
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: newThread => {
        queryClient.invalidateQueries(['threads', newThread.uuid]);
      },
    },
  );

  const { mutate: unFavoriteMutate } = useMutation<any, AxiosError, any, any>(
    (thread: ThreadSchema) => unFavoriteThread(thread),
    {
      onMutate: async newThread => {
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: newThread => {
        queryClient.invalidateQueries(['threads', newThread.uuid]);
      },
    },
  );

  const { mutate: assignMutate } = useMutation<any, AxiosError, any, any>(
    (payload: { thread: ThreadSchema; assignee_id: string }) => assignConversationThread(payload),
    {
      onMutate: async data => {
        const { thread: newThread } = data;
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        console.log({ previousThread, newThread, data });
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: response => {
        const { data } = response;
        const { thread } = data;

        queryClient.invalidateQueries(['threads', thread.uuid]);
      },
    },
  );

  const { mutate: tagMutate } = useMutation<any, AxiosError, any, any>(
    (payload: { thread: ThreadSchema; tag: InboxTag }) => tagConversation(payload),
    {
      onMutate: async data => {
        const { thread: newThread } = data;
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: newThread => {
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Conversation tagged successfully"
            />
          ),
        });
        queryClient.invalidateQueries(['threads', newThread.uuid]);
      },
    },
  );

  const { mutate: unTagMutate } = useMutation<any, AxiosError, any, any>(
    (payload: { thread: ThreadSchema; tag: InboxTag }) => unTagConversation(payload),
    {
      onMutate: async data => {
        const { thread: newThread } = data;
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(['threads', thread.uuid]);
      },
    },
  );

  const { isLoading: isAddingNote, mutate: addNoteMutate } = useMutation<any, AxiosError, any, any>(
    (payload: Partial<NoteSchema>) =>
      addConversationNote({
        note: payload,
        customer_id: sender.uuid,
      }),
    {
      onMutate: async data => {
        await queryClient.cancelQueries(['notes', sender.uuid]);
        const previousNotes = queryClient.getQueryData(['notes', sender.uuid]);
        queryClient.setQueryData(['notes', sender.uuid], old => {
          return {
            //@ts-ignore
            ...old,
            //@ts-ignore
            pages: old.pages.map(page => {
              if (page.data.meta.page === 1) {
                return {
                  ...page,
                  data: {
                    ...page.data,
                    notes: [
                      { ...data, created_datetime: formatISO(new Date()) },
                      ...page.data.notes,
                    ],
                  },
                };
              }
              return page;
            }),
          };
          // return [...oldData, data];
        });
        return { previousNotes };
      },
      onSuccess: () => {
        onCloseNoteModal();
        queryClient.invalidateQueries(['notes', sender.uuid]);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox status="success" onClose={onClose} message="Note added successfully" />
          ),
        });
      },
      onError: (error, newData, context) => {
        queryClient.setQueryData('notes', context.previousNotes);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={error.message} />,
        });
      },
    },
  );

  const { isLoading: isClosingConversation, mutate: closeMutate } = useMutation<
    any,
    AxiosError,
    any,
    any
  >(
    (payload: { thread: ThreadSchema; notePayload: any }) =>
      resolveConversationThread(payload.thread),
    {
      onMutate: async ({ thread: newThread, notePayload }) => {
        await queryClient.cancelQueries(['threads', newThread.uuid]);
        const previousThread = queryClient.getQueryData(['threads', thread.uuid]);
        queryClient.setQueryData(['threads', newThread.uuid], newThread);
        !!notePayload.content && addNoteMutate(notePayload);
        return { previousThread, newThread };
      },
      onError: (err, newThread, context) => {
        queryClient.setQueryData(['threads', context.newThread.uuid], context.previousTodo);
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => <ToastBox onClose={onClose} message={err.message} />,
        });
      },
      onSettled: newThread => {
        onCloseCloseConversationModal();
        toast({
          position: 'bottom-left',
          render: ({ onClose }) => (
            <ToastBox
              status="success"
              onClose={onClose}
              message="Conversation closed successfully"
            />
          ),
        });
        queryClient.invalidateQueries(['threads', newThread.uuid]);
      },
    },
  );

  // const handleSnooze = (date: Date) => {};

  const handleAssign = (assignee: Partial<TeamMember>) => {
    const { id: assignee_id, first_name, last_name } = assignee;
    assignMutate({
      assignee_id,
      thread_id: uuid,
      thread: {
        ...thread,
        assignees: [
          ...(thread?.assignees ?? []),
          {
            last_name,
            first_name,
            user_id: assignee_id,
            organisation_id: organizationID,
          },
        ],
      },
    });
  };

  const handleClose = (notePayload: { topic: string; status: string; content: string }) => {
    closeMutate({ thread: { ...thread, state: 'resolved' }, notePayload });
  };

  const handleFavorite = () => {
    favoriteMutate({ ...thread, is_favorited: true });
  };

  const handleUnFavorite = () => {
    unFavoriteMutate({ ...thread, is_favorited: false });
  };

  const handleTag = (tag: InboxTag) => {
    tagMutate({ tag, thread: { ...thread, tags: [...thread.tags, tag] } });
  };

  const handleUnTag = (tag: InboxTag) => {
    unTagMutate({
      tag,
      thread: { ...thread, tags: thread.tags.filter(item => item.uuid !== tag.uuid) },
    });
  };

  const handleTagClick = (tag: InboxTag) => {
    const threadTagIds = thread.tags.map(item => item.uuid);
    if (threadTagIds.includes(tag.uuid)) {
      handleUnTag(tag);
    } else {
      handleTag(tag);
    }
  };

  const handleFavoriteClick = () => {
    if (is_favorited) {
      handleUnFavorite();
    } else {
      handleFavorite();
    }
  };

  const handleAddNote = (values: Partial<NoteSchema>) => {
    addNoteMutate(values);
  };

  const handleOpenAssignMenu = () => {
    onOpenAssignMenu();
  };

  return (
    <>
      <Flex
        pb="0.875rem"
        width="100%"
        alignItems="center"
        borderBottomWidth="1px"
        justifyContent="space-between"
      >
        <Stack spacing="0.75rem" isInline alignItems="center">
          <Icon size="1.5rem" name={channelOptions[channel]?.icon} color="gray.800" />
          <Subtitle>
            {sender.channel_name === 'email'
              ? lastMessage?.content.subject
              : sender.name ?? sender.platform_nick}
          </Subtitle>
        </Stack>
        <Stack isInline spacing="0.875rem" alignItems="center">
          <Tooltip
            placement="bottom"
            shouldWrapChildren
            label={thread?.assignees
              ?.map(item => `${item.first_name} ${item.last_name}`)
              .join(', ')}
            aria-label={
              thread?.assignees?.map(item => `${item.first_name} ${item.last_name}`).join(', ') ??
              ''
            }
          >
            <AvatarGroup max={2} size="sm" mr="0.875rem">
              {thread?.assignees?.map(item => (
                <Avatar
                  color="white"
                  key={item.uuid}
                  name={`${item.first_name} ${item.last_name}`}
                />
              ))}
            </AvatarGroup>
          </Tooltip>
          {/* <Box>
            <SnoozeMenu onSelectDate={handleSnooze} />
          </Box> */}
          <Box>
            <Tooltip
              label={is_favorited ? 'Unfavorite' : 'Favorite'}
              aria-label={is_favorited ? 'Unfavorite' : 'Favorite'}
            >
              <Button px="0" minW="unset" variant="unstyled" onClick={handleFavoriteClick}>
                <Icon
                  size="1.5rem"
                  name="inbox-favorite"
                  color={is_favorited ? '#FFD76E' : 'gray.400'}
                />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <TagsMenu tags={tags} onItemClick={handleTagClick} conversationTags={thread.tags} />
          </Box>
          <Box>
            <MoreOptionsMenu
              onAssign={handleAssign}
              options={
                thread.state !== 'resolved'
                  ? [
                      {
                        label: 'Add Notes',
                        iconProps: { color: 'blue.500', name: 'inbox-add-note' },
                        onItemClick: onOpenNoteModal,
                      },
                      {
                        label: 'Close Conversation',
                        onItemClick: onOpenCloseConversationModal,
                        iconProps: { color: '#5ACA75', name: 'inbox-resolve-conversation' },
                      },
                      {
                        label: 'Assign Conversation',
                        iconProps: { color: '#AF78FF', name: 'inbox-assign-conversation' },
                        onItemClick: handleOpenAssignMenu,
                      },
                      // {
                      //   label: 'Mark Unread',
                      //   iconProps: { color: '#50D2A0', name: 'inbox-mark-unread' },
                      //   onItemClick: console.log,
                      // },
                    ]
                  : [
                      {
                        label: 'Add Notes',
                        iconProps: { color: 'blue.500', name: 'inbox-add-note' },
                        onItemClick: onOpenNoteModal,
                      },
                      {
                        label: 'Assign Conversation',
                        iconProps: { color: '#AF78FF', name: 'inbox-assign-conversation' },
                        onItemClick: handleOpenAssignMenu,
                      },
                      // {
                      //   label: 'Mark Unread',
                      //   iconProps: { color: '#50D2A0', name: 'inbox-mark-unread' },
                      //   onItemClick: console.log,
                      // },
                    ]
              }
            />
          </Box>
        </Stack>
      </Flex>
      <AssignmentMenu
        isOpen={isAssignMenuOpen}
        onClose={onCloseAssignMenu}
        onItemClick={handleAssign}
        assignments={thread.assignees}
      />
      <NoteModal
        isLoading={isAddingNote}
        onSubmit={handleAddNote}
        isOpen={isNoteModalOpen}
        onClose={onCloseNoteModal}
      />
      <CloseConversationModal
        onSubmit={handleClose}
        userNick={thread.sender.name}
        isLoading={isClosingConversation}
        isOpen={isCloseConversationModalOpen}
        onClose={onCloseCloseConversationModal}
      />
    </>
  );
};
