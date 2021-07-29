import { Avatar, Box, Flex, Icon, PseudoBox, Stack, useToast } from '@chakra-ui/core';
import styled from '@emotion/styled';
import { BodyText, Button, SmallText, ToastBox, XSmallText } from 'app/components';
import {
  selectOrganisationID,
  selectProfile,
  selectUserID,
} from 'app/unauthenticated-app/authentication';
import { AxiosError } from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { unescape } from 'lodash';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import { channelOptions } from '../..';
import { assignConversationThread } from '../../inbox.service';
import { Channel, ThreadSchema } from '../../inbox.types';

export type ThreadItemProps = {
  thread: any;
  isActive?: boolean;
  onAssign?(thread?: any): void;
  onClick?(thread: ThreadSchema): void;
};

export const ThreadItem = (props: ThreadItemProps) => {
  const { thread, onClick, isActive, onAssign } = props;
  const {
    uuid,
    state,
    sender = {},
    unread_count,
    receiver = {},
    updated_datetime,
    last_message = {},
  } = thread;
  const channel: Channel = sender?.channel_name;
  const style = isActive ? { bg: 'gray.200', rounded: '8px' } : { borderBottomWidth: '1px' };

  const toast = useToast();
  const queryClient = useQueryClient();
  const user_id = useSelector(selectUserID);
  const profile = useSelector(selectProfile);
  const organizationID = useSelector(selectOrganisationID);

  const { mutate: assignMutate, isLoading: isAssigning } = useMutation<any, AxiosError, any, any>(
    (payload: { thread: ThreadSchema; assignee_id: string }) => assignConversationThread(payload),
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
      onSettled: response => {
        const { data } = response;
        const { thread } = data;
        onAssign?.(thread);

        queryClient.invalidateQueries(['threads', thread.uuid]);
      },
    },
  );

  const handleClick = () => {
    onClick?.(thread);
  };

  const handleAssign = () => {
    const assignee_id = user_id;
    assignMutate({
      assignee_id,
      thread_id: uuid,
      thread: {
        ...thread,
        assignees: [
          {
            user_id,
            last_name: profile?.last_name,
            organisation_id: organizationID,
            first_name: profile?.first_name,
          },
        ],
      },
    });
  };

  return (
    <ThreadItemContainer
      py="0.5rem"
      px="0.75rem"
      cursor="pointer"
      bg="transparent"
      position="relative"
      onClick={handleClick}
      _hover={{
        rounded: '8px',
        borderBottomWidth: '0',
        bg: isActive ? 'gray.200' : 'rgba(240, 238, 253, 0.66)',
      }}
      {...style}
    >
      {state === 'queued' && (
        <Flex
          top="0"
          left="0"
          z-index={2}
          opacity={0}
          width="100%"
          height="100%"
          position="absolute"
          alignItems="center"
          justifyContent="center"
          className="assign-to-me-btn"
        >
          <Button
            size="xs"
            width="132px"
            rounded="100px"
            fontWeight="normal"
            variantColor="blue"
            onClick={handleAssign}
            isLoading={isAssigning}
          >
            Assign to self
          </Button>
        </Flex>
      )}
      <Stack width="100%" isInline>
        <Avatar
          size="sm"
          bg="#5D34A5"
          color="white"
          name={sender.name}
          src={sender?.image_url ?? undefined}
        />
        <Box flex={1}>
          <Flex alignItems="center" justifyContent="space-between">
            <BodyText flex={1} pb="0.25rem" color="gray.900">
              {sender.name ?? sender.platform_nick}
            </BodyText>
            {state === 'queued' ? (
              <Box width="0.5rem" height="0.5rem" rounded="50%" bg="blue.500" />
            ) : (
              !!unread_count && <XSmallText color="gray.700">{unread_count}</XSmallText>
            )}
          </Flex>
          <SmallText
            mb="0.5rem"
            width="250px"
            color="gray.700"
            overflow="hidden"
            whiteSpace="nowrap"
            style={{ textOverflow: 'ellipsis' }}
            dangerouslySetInnerHTML={{
              __html: last_message?.content?.subject
                ? unescape(last_message?.content?.subject)
                : unescape(last_message?.content?.body),
            }}
          />
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            <XSmallText color="gray.400">
              {formatDistanceToNowStrict(new Date(updated_datetime), {
                addSuffix: true,
              })}
            </XSmallText>
            <Stack isInline alignItems="center">
              <XSmallText>{receiver.platform_name}</XSmallText>
              <Icon name={channelOptions[channel]?.icon} color="gray.500" />
            </Stack>
          </Flex>
        </Box>
      </Stack>
    </ThreadItemContainer>
  );
};

const ThreadItemContainer = styled(PseudoBox)`
  &:hover {
    .assign-to-me-btn {
      opacity: 1;
    }
  }
`;
