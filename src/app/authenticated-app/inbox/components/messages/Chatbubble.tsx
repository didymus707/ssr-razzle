import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  Image,
  Link,
  PseudoBox,
  Spinner,
  Stack,
  Tooltip,
} from '@chakra-ui/core';
import styled from '@emotion/styled';
import { BodyText, Button, SmallText, Subtitle, TextWithLink, XSmallText } from 'app/components';
import React, { forwardRef, MutableRefObject, ReactNode } from 'react';
import { useQuery } from 'react-query';
import { numberWithCommas } from 'utils';
import { updateConversationNotificationStatus } from '../../inbox.service';
import { InboxMessage, ThreadSchema } from '../../inbox.types';
import { formatMessageDateTime, isOnlyEmoji } from '../../inbox.utils';
import { Attachment } from './Attachment';
import { Attachments } from './compose/Attachments';

export type ChatbubbleProps = {
  receiver: any;
  thread?: ThreadSchema;
  message: InboxMessage;
  emailBubbleDefaultIndex?: number[];
  onEmailReply?(message: InboxMessage): void;
  onEmailForward?(message: InboxMessage): void;
  onEmailReplyAll?(message: InboxMessage): void;
  timeViewRef: MutableRefObject<HTMLParagraphElement | undefined>;
};

export const Chatbubble = (props: ChatbubbleProps) => {
  const {
    thread,
    message,
    receiver,
    timeViewRef,
    onEmailReply,
    onEmailForward,
    onEmailReplyAll,
    emailBubbleDefaultIndex,
  } = props;
  const { uuid, author, meta, type, content, attachments, status, request } = message;

  const threadType = thread?.type;
  // const firstAttachment = attachments?.[0];
  const hasAttachment = !!attachments && !!attachments.length;
  // const attachmentType = !!firstAttachment && firstAttachment.type;
  const isChannelAcct = receiver.user_id === author.uuid;
  // const copyAttachmentText = `Copy link to ${attachmentType === 'image' ? 'image' : 'file'}`;
  const isRhs =
    !author.is_customer || !!(isChannelAcct && meta?.message_type !== 'payment_received');

  // const { onCopy } = useClipboard(firstAttachment?.data?.url);
  // const onDownload = () => {
  //   window.open(firstAttachment?.data?.url, '_blank');
  // };

  // const menuOptions = hasAttachment
  //   ? !content?.body
  //     ? [
  //         { label: copyAttachmentText, onItemClick: onCopy },
  //         { label: 'Download', onItemClick: onDownload },
  //       ]
  //     : [
  //         { label: 'Reply', onItemClick: () => {} },
  //         { label: copyAttachmentText, onItemClick: onCopy },
  //         { label: 'Download', onItemClick: onDownload },
  //       ]
  //   : [{ label: 'Reply', onItemClick: () => {} }];

  const renderBubbleContent = () => {
    if (isOnlyEmoji(content?.body)) {
      return (
        <ChatContainer
          isRhs={isRhs}
          message={message}
          threadType={threadType}
          timeViewRef={timeViewRef}
        >
          <Box px="1rem" py="1.25rem">
            <SmallText lineHeight="30px" fontSize="2rem" color="gray.900">
              {content?.body}
            </SmallText>
          </Box>
        </ChatContainer>
      );
    }
    if (meta?.message_type?.includes('payment_')) {
      const paymentLink = content.body.split('\n')[1];
      return (
        <ChatContainer
          isRhs={isRhs}
          message={message}
          threadType={threadType}
          timeViewRef={timeViewRef}
        >
          {isRhs ? (
            <Stack px="1rem" py="1.25rem" isInline spacing="0.75rem">
              <Image width="144px" src="/images/inbox/payment.png" />
              <Flex position="relative" flexDirection="column" justifyContent="space-between">
                {meta.message_type === 'payment_received' ? (
                  <BodyText color="gray.900">
                    You Just Got{' '}
                    <PseudoBox as="span" color="blue.500">
                      Paid!!
                    </PseudoBox>
                  </BodyText>
                ) : (
                  <BodyText color="gray.900">
                    You Just{' '}
                    <PseudoBox as="span" color="blue.500">
                      Requested
                    </PseudoBox>
                  </BodyText>
                )}
                {!!request && (
                  <Subtitle color="blue.600">
                    <PseudoBox as="span" fontWeight="1.25rem">
                      {request?.currency}
                    </PseudoBox>{' '}
                    {numberWithCommas(request?.amount / 100)}
                  </Subtitle>
                )}
                <Link
                  isExternal
                  color="gray.900"
                  href={paymentLink}
                  fontSize="0.75rem"
                  fontWeight="medium"
                  textDecoration="underline"
                >
                  View Details
                </Link>
              </Flex>
            </Stack>
          ) : (
            <Box px="1rem" py="1.25rem">
              <TextWithLink wordBreak="break-word" text={content?.body} />
            </Box>
          )}
        </ChatContainer>
      );
    }
    if (receiver.channel_name === 'email') {
      return (
        <EmailContainer
          isRhs={isRhs}
          message={message}
          receiver={receiver}
          onReply={onEmailReply}
          onForward={onEmailForward}
          onReplyAll={onEmailReplyAll}
          defaultIndex={emailBubbleDefaultIndex}
        />
      );
    }
    if (type === 'comment') {
      return (
        <CommentContainer message={message} threadType={threadType} timeViewRef={timeViewRef}>
          {hasAttachment ? (
            !!status ? (
              <Attachment isOrgUser={isRhs} receiver={receiver} attachments={attachments} />
            ) : (
              <Box p="1rem">
                <Flex rounded="8" alignItems="center" justifyContent="space-between">
                  <SmallText>Uploading file(s)</SmallText>
                  <Spinner color="blue.500" size="xs" />
                </Flex>
              </Box>
            )
          ) : null}
          {content?.body && (
            <Box px="1rem" py="1.25rem">
              <TextWithLink wordBreak="break-word" text={content?.body} />
            </Box>
          )}
        </CommentContainer>
      );
    }

    return (
      <ChatContainer
        isRhs={isRhs}
        message={message}
        threadType={threadType}
        timeViewRef={timeViewRef}
      >
        {/* <Menu
          options={menuOptions}
          renderItem={renderChatBubbleMenuItem}
          menuListProps={{
            minW: '160px',
            placement: isRhs ? 'bottom-end' : 'bottom-start',
          }}
          menuButtonProps={{
            px: '0',
            opacity: 0,
            minW: 'unset',
            right: '1rem',
            position: 'absolute',
            className: 'chat-bubble-more-button',
            children: <Icon size="1.5rem" name="inbox-more" color="black" />,
          }}
        /> */}
        {hasAttachment ? (
          !!status ? (
            <Attachment isOrgUser={isRhs} receiver={receiver} attachments={attachments} />
          ) : (
            <Box p="1rem">
              <Flex rounded="8" alignItems="center" justifyContent="space-between">
                <SmallText>Uploading file(s)</SmallText>
                <Spinner color="blue.500" size="xs" />
              </Flex>
            </Box>
          )
        ) : null}
        {content?.body && (
          <Box px="1rem" py="1.25rem">
            <TextWithLink wordBreak="break-word" text={content?.body} />
          </Box>
        )}
      </ChatContainer>
    );
  };

  useQuery(
    ['update-message-notification', uuid],
    () => updateConversationNotificationStatus({ message_id: uuid }),
    {
      enabled: !!uuid && ['sent', 'delivered'].includes(status),
    },
  );

  return renderBubbleContent();
};

const ChatContainer = (props: {
  isRhs: boolean;
  children: ReactNode;
  threadType?: string;
  message: ChatbubbleProps['message'];
  timeViewRef: ChatbubbleProps['timeViewRef'];
}) => {
  const { isRhs, message, children, threadType, timeViewRef } = props;

  return (
    <Flex width="100%" flexDirection={isRhs ? 'row-reverse' : 'row'}>
      <Stack maxWidth="65.4%" alignItems={isRhs ? 'flex-end' : 'unset'}>
        <Stack width="100%" alignItems={isRhs ? 'flex-end' : 'flex-start'}>
          <BubbleContainer
            rounded="12px"
            borderWidth="1px"
            position="relative"
            borderColor={isRhs ? '#D2CEF9' : 'gray.300'}
            bg={isRhs ? '#F7F7FE' : 'white'}
          >
            {children}
          </BubbleContainer>
          <ChatbubbleBottom
            threadType={threadType}
            isRhs={isRhs}
            message={message}
            timeViewRef={timeViewRef}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

const EmailContainer = (props: {
  isRhs: boolean;
  message: ChatbubbleProps['message'];
  receiver: ChatbubbleProps['receiver'];
  onReply?: ChatbubbleProps['onEmailReply'];
  onForward?: ChatbubbleProps['onEmailForward'];
  onReplyAll?: ChatbubbleProps['onEmailReplyAll'];
  defaultIndex?: ChatbubbleProps['emailBubbleDefaultIndex'];
}) => {
  const { isRhs, onReply, message, receiver, onForward, onReplyAll, defaultIndex = [0] } = props;
  const { meta, author, created_datetime, content, attachments } = message;

  const cc = meta?.cc?.map((item, index) =>
    index === (meta?.cc?.length ?? 0) - 1 ? `${item}` : `${item}, `,
  );
  const bcc = meta?.bcc?.map((item, index) =>
    index === (meta?.bcc?.length ?? 0) - 1 ? `${item}` : `${item}, `,
  );

  return (
    <Accordion position="relative" defaultIndex={defaultIndex} allowMultiple>
      <AccordionItem borderWidth="1px" rounded="12px">
        {({ isExpanded }) => (
          <>
            <AccordionHeader
              pb="1rem"
              pt="1rem"
              px="1rem"
              display="flex"
              alignItems="center"
              _hover={{ bg: 'transparent' }}
              _focus={{ boxShadow: 'none' }}
            >
              <AccordionIcon
                alignSelf="flex-start"
                name={isExpanded ? 'chevron-up' : 'chevron-right'}
              />
              <Box flex={1} pl="1.25rem" borderBottomWidth={isExpanded ? '1px' : '0'}>
                {isExpanded ? (
                  <Box>
                    <Stack pb="0.2rem" isInline alignItems="center" justifyContent="space-between">
                      <BodyText color="gray.900">{receiver.platform_name}</BodyText>
                      <SmallText color="gray.500">
                        {formatMessageDateTime(
                          created_datetime ? new Date(created_datetime) : new Date(),
                        )}
                      </SmallText>
                    </Stack>
                    <BodyText textAlign="left" pb="0.2rem" color="blue.500">
                      {message.content.subject}
                    </BodyText>
                    <Box pb="1rem">
                      <Flex pb="0.5rem" alignItems="center" justifyContent="space-between">
                        <Stack spacing="0.1rem" isInline alignItems="center">
                          <SmallText color="gray.400">{isRhs ? 'From: ' : 'To: '}</SmallText>
                          <SmallText color="gray.900">
                            {isRhs ? author.platform_nick : receiver.platform_nick}
                          </SmallText>
                        </Stack>
                        <EmailContainerActions
                          onReply={() => onReply?.(message)}
                          onForward={() => onForward?.(message)}
                          onReplyAll={() => onReplyAll?.(message)}
                        />
                      </Flex>
                      <Stack spacing="0.1rem" isInline alignItems="center">
                        <SmallText color="gray.400">{isRhs ? 'To: ' : 'From: '}</SmallText>
                        <SmallText color="gray.900">
                          {isRhs ? receiver.platform_nick : author.platform_nick}
                        </SmallText>
                      </Stack>
                      {(meta?.bcc || meta?.cc) && (
                        <>
                          {meta?.cc && (
                            <Stack pt="0.5rem" spacing="0.1rem" isInline alignItems="center">
                              <SmallText color="gray.400" textTransform="uppercase">
                                CC:
                              </SmallText>
                              {meta?.cc.length > 2 ? (
                                <Tooltip label={meta?.cc?.join(', ')} aria-label="cc">
                                  <SmallText
                                    width="250px"
                                    color="gray.900"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    style={{ textOverflow: 'ellipsis' }}
                                  >
                                    {cc}
                                  </SmallText>
                                </Tooltip>
                              ) : (
                                <SmallText width="250px" color="gray.900">
                                  {cc}
                                </SmallText>
                              )}
                            </Stack>
                          )}
                          {meta?.bcc && (
                            <Stack pt="0.5rem" spacing="0.1rem" isInline alignItems="center">
                              <SmallText color="gray.400" textTransform="uppercase">
                                BCC:
                              </SmallText>
                              {meta?.bcc.length > 2 ? (
                                <Tooltip label={meta?.bcc?.join(', ')} aria-label="bcc">
                                  <SmallText
                                    width="250px"
                                    color="gray.900"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                    style={{ textOverflow: 'ellipsis' }}
                                  >
                                    {bcc}
                                  </SmallText>
                                </Tooltip>
                              ) : (
                                <SmallText width="250px" color="gray.900">
                                  {bcc}
                                </SmallText>
                              )}
                            </Stack>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Flex alignItems="center" justifyContent="space-between">
                    <Stack isInline spacing="1.25rem" alignItems="center">
                      <BodyText color="gray.900">{receiver.platform_name}</BodyText>
                      <Stack isInline alignItems="center">
                        <BodyText color="gray.500">To:</BodyText>
                        <BodyText color="gray.900">
                          {isRhs ? author.platform_nick : receiver.platform_nick}
                        </BodyText>
                      </Stack>
                    </Stack>
                    <EmailContainerActions
                      onReply={() => onReply?.(message)}
                      onForward={() => onForward?.(message)}
                      onReplyAll={() => onReplyAll?.(message)}
                    />
                  </Flex>
                )}
              </Box>
            </AccordionHeader>
            <AccordionPanel
              pt="0"
              pb="1rem"
              pr="1.5rem"
              pl="3.125rem"
              overflow="auto"
              borderBottomWidth="0"
              borderColor="transparent"
            >
              <BodyText dangerouslySetInnerHTML={{ __html: content?.body }} />
              {!!attachments?.length && (
                <Box mt="2rem" pt="1rem" borderTopWidth="1px" borderTopColor="gray.300">
                  <SmallText pb="1rem" color="gray.600">
                    {attachments?.length} {attachments?.length > 1 ? 'attachments' : 'attachment'}
                  </SmallText>
                  <Attachments files={attachments} setFiles={() => {}} showDeleteButton={false} />
                </Box>
              )}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

const CommentContainer = (props: {
  isRhs?: boolean;
  children: ReactNode;
  threadType?: string;
  message: ChatbubbleProps['message'];
  timeViewRef: ChatbubbleProps['timeViewRef'];
}) => {
  const { isRhs = true, message, children, threadType, timeViewRef } = props;
  return (
    <Flex width="100%" flexDirection="row-reverse">
      <Stack maxWidth="65.4%" alignItems="flex-end">
        <Stack width="100%" alignItems="flex-end">
          <BubbleContainer
            rounded="12px"
            borderWidth="1px"
            position="relative"
            bg="rgba(255, 215, 110, 0.19)"
            borderColor="rgba(255, 215, 110, 0.44)"
          >
            {/* <Menu
              options={[{ label: 'Reply', onItemClick: () => {} }]}
              renderItem={renderChatBubbleMenuItem}
              menuListProps={{
                placement: 'bottom-end',
              }}
              menuButtonProps={{
                px: '0',
                opacity: 0,
                minW: 'unset',
                right: '1rem',
                position: 'absolute',
                className: 'chat-bubble-more-button',
                children: <Icon size="1.5rem" name="inbox-more" color="black" />,
              }}
            /> */}
            {children}
          </BubbleContainer>
          <ChatbubbleBottom
            isRhs={isRhs}
            message={message}
            threadType={threadType}
            timeViewRef={timeViewRef}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

const ChatbubbleBottom = forwardRef(
  (
    props: {
      isRhs: boolean;
      threadType?: string;
      message: ChatbubbleProps['message'];
      timeViewRef: ChatbubbleProps['timeViewRef'];
    },
    ref: any,
  ) => {
    const { message, isRhs, timeViewRef, threadType } = props;
    const { author, status, created_datetime, content } = message;

    return (
      <Box ref={ref}>
        {content?.content_type !== 'html' && (
          <Flex
            width="100%"
            lineHeight=".875rem"
            alignItems="center"
            justifyContent={status === 'unsent' ? 'space-between' : undefined}
            flexDirection={isRhs ? 'row-reverse' : 'row'}
          >
            <Flex alignItems="center" flexDirection={isRhs ? 'row' : 'row-reverse'}>
              {(isRhs || threadType === 'group') && (
                <>
                  <XSmallText color="gray.400">{author.name}</XSmallText>
                  <XSmallText color="gray.400" ref={timeViewRef} marginX="0.5rem">
                    -
                  </XSmallText>
                </>
              )}
              <XSmallText color="gray.400" ref={timeViewRef}>
                {formatMessageDateTime(created_datetime ? new Date(created_datetime) : new Date())}
              </XSmallText>
            </Flex>
          </Flex>
        )}
        {status === 'unsent' && (
          <Stack pt="0.5rem" isInline alignItems="center">
            <Button variant="ghost" height="auto" minW="auto" px="0" onClick={() => {}}>
              <Icon size="1rem" color="#5ACA75" name="inbox-resend-failed-message" />
            </Button>
            <Button variant="ghost" height="auto" minW="auto" px="0" onClick={() => {}}>
              <Icon size="1rem" color="#F48989" name="inbox-delete-failed-message" />
            </Button>
            <XSmallText color="#DA1414">Failed</XSmallText>
          </Stack>
        )}
      </Box>
    );
  },
);

// const renderChatBubbleMenuItem = (
//   item: { label?: ReactNode; onItemClick?(): void },
//   index?: number,
// ) => {
//   const { label, onItemClick } = item;

//   return (
//     <MenuItem key={`${index}`} onClick={() => onItemClick?.()}>
//       <XSmallText textAlign="center" color="gray.900">
//         {label}
//       </XSmallText>
//     </MenuItem>
//   );
// };

const BubbleContainer = styled(Box)`
  width: 100%;
  transition: all 0.2s;
  &:hover {
    .chat-bubble-more-button {
      opacity: 1;
    }
  }
`;

const EmailContainerActions = (props: {
  onReply?(): void;
  onReplyAll?(): void;
  onForward?(): void;
}) => {
  const { onReply, onForward, onReplyAll } = props;
  return (
    <Stack isInline spacing="1rem" alignItems="center">
      <Button
        size="xs"
        variant="ghost"
        fontWeight="normal"
        //@ts-ignore
        leftIcon="inbox-reply-all"
        onClick={e => {
          e.stopPropagation();
          onReplyAll?.();
        }}
      >
        Reply all
      </Button>
      <Button
        size="xs"
        variant="ghost"
        fontWeight="normal"
        //@ts-ignore
        leftIcon="inbox-reply"
        onClick={e => {
          e.stopPropagation();
          onReply?.();
        }}
      >
        Reply
      </Button>
      <Button
        size="xs"
        variant="ghost"
        fontWeight="normal"
        //@ts-ignore
        leftIcon="inbox-forward"
        onClick={e => {
          e.stopPropagation();
          onForward?.();
        }}
      >
        Forward
      </Button>
    </Stack>
  );
};
