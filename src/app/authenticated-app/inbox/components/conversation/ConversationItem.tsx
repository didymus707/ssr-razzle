import React, { useEffect, useMemo, useState } from 'react';
import { Flex, Text, Box, PseudoBox, Button, useToast } from '@chakra-ui/core';
import { ConversationItemProps } from '../../inbox.types';
import { HighlightableText, ToastBox, SocialIcon } from '../../../../components';
import { formatTime, isOnlyEmoji } from '../../inbox.utils';
import {
  assignThread,
  makeSelectCustomerByID,
  makeSelectMessageNotificationStatus,
  makeSelectThreadById,
  selectLatestMessage,
  selectName,
  selectThreadAssigningState,
} from '../../slices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../root';
import { selectUserID } from '../../../../unauthenticated-app/authentication';
import { useHistory, useParams } from 'react-router-dom';
import { INBOX_INIT } from '../../inbox.data';
import { selectThreadReceiverPlatformID } from '../../../channels';

export function ConversationItem({ highlight, itemID }: ConversationItemProps) {
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const selectCustomerByID = useMemo(makeSelectCustomerByID, []);
  const selectThreadById = useMemo(makeSelectThreadById, []);
  const selectMessageNotificationStatus = useMemo(makeSelectMessageNotificationStatus, []);

  const thread =
    useSelector((state: RootState) => selectThreadById(state, itemID)) || INBOX_INIT.thread;

  const threadReceiverUserID = useSelector((state: RootState) =>
    selectThreadReceiverPlatformID(state, itemID),
  );
  const sender_name = useSelector((state: RootState) =>
    selectName(state, {
      id: thread.sender_id,
      // @ts-ignore
      credentialUserID: threadReceiverUserID
    }),
  );

  const sender =
    useSelector((state: RootState) => selectCustomerByID(state, thread.sender_id)) ||
    INBOX_INIT.customer;
  const lastMessage =
    useSelector((state: RootState) => selectLatestMessage(state, thread.uuid)) ||
    INBOX_INIT.message;

  const assigningState = useSelector((state: RootState) =>
    selectThreadAssigningState(state, thread.uuid),
  );

  const user_id = useSelector(selectUserID);
  const notificationStatus =
    useSelector((state: RootState) =>
      selectMessageNotificationStatus(state, {
        message_id: lastMessage.uuid,
        user_id: user_id || '',
      }),
    ) || INBOX_INIT.notification.status;
  const currentThreadID = params.id === 'new' ? '' : params.id;

  const [showAssignBtn, setShowAssignBtn] = useState<boolean>(false);
  const toast = useToast();

  const { state, updated_datetime } = thread;

  const { content = '', attachments } = lastMessage;
  const { channel = '' } = sender;
  const isQueued = state === 'queued';

  const text =
    attachments && attachments.length > 0
      ? '[Attachment]'
      : isOnlyEmoji(content?.substring(0, 24) || '')
      ? (content || '').length <= 24
        ? content
        : `${content?.substring(0, 24)}...`
      : (content || '').length <= 37
      ? content
      : `${content?.substring(0, 34)}...`;

  const handleItemClicked = async (id: string) => {
    if (isQueued) {
      user_id &&
        dispatch(
          assignThread({
            thread_id: id,
            assignee_id: user_id,
          }),
        );
    } else {
      history.push(`/s/inbox/${id}`);
    }
  };

  useEffect(() => {
    if (assigningState === 'fulfilled') {
      history.push(`/s/inbox/${itemID}`);
    } else if (assigningState === 'rejected') {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Error: Failed to assign thread" />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assigningState]);

  return (
    <PseudoBox
      as="div"
      _hover={{ bg: 'rgba(0, 0, 0, 0.05)', cursor: 'pointer' }}
      _focus={{ bg: 'rgba(0, 0, 0, 0.05)', outline: 'none', cursor: 'pointer' }}
      tabIndex={0}
      bg={currentThreadID === itemID ? 'rgba(61, 80, 223, 0.0557802)' : 'initial'}
      onMouseEnter={isQueued ? () => setShowAssignBtn(true) : undefined}
      onMouseLeave={isQueued ? () => setShowAssignBtn(false) : undefined}
      onClick={() => handleItemClicked(itemID)}
      color="brandBlack"
    >
      <Box marginX="1rem" position="relative">
        {showAssignBtn && isQueued && (
          <Flex
            bg="transparent"
            position="absolute"
            left="0"
            top="0"
            right="0"
            bottom="0"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              fontSize=".875rem"
              variantColor="blue"
              color="#f6fafd"
              p=".5rem 1rem"
              height="initial"
              minWidth="initial"
              zIndex={2}
              borderRadius="25px"
              boxShadow="0 2px 4px 0 rgba(0, 0, 0, 0.22)"
              loadingText="Assigning ..."
              isLoading={assigningState === 'pending'}
            >
              Assign to me
            </Button>
          </Flex>
        )}

        <Flex py=".5rem" textAlign="left" alignItems="center">
          <SocialIcon which={channel || ''} size="2rem" />

          <Box ml="1.0625rem" flex={1}>
            <Flex justifyContent="space-between" alignItems="flex-start" marginBottom=".625rem">
              <Text fontSize=".875em" fontWeight={500}>
                {(sender_name || '').length > 19
                  ? `${(sender_name || '').substr(0, 19)}...`
                  : sender_name}
              </Text>

              <Text flex="1" ml=".9375rem" textAlign="right" opacity={0.5} fontSize=".75rem">
                {formatTime(new Date(updated_datetime as string))}
              </Text>
            </Flex>

            <Flex justifyContent="space-between">
              <HighlightableText
                text={text}
                highlight={highlight}
                opacity={0.5}
                fontSize=".75rem"
              />

              {(isQueued || !['read', 'unsent'].includes(notificationStatus)) && (
                <Box padding=".25rem" height="0" backgroundColor="blue.500" borderRadius="50%" />
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    </PseudoBox>
  );
}
