import { Box, Flex, Spinner } from '@chakra-ui/core';
import { BodyText, FullPageSpinner } from 'app/components';
import React, { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThreadSchema } from '../../inbox.types';
import { Chatbubble, ChatbubbleProps } from './Chatbubble';

export type ConversationThreadContentProps = {
  messages?: any[];
  hasMore?: boolean;
  isFetching?: boolean;
  thread?: ThreadSchema;
  onFetchMoreData?(): void;
  onEmailReply?: ChatbubbleProps['onEmailReply'];
  onEmailForward?: ChatbubbleProps['onEmailForward'];
  onEmailReplyAll?: ChatbubbleProps['onEmailReplyAll'];
};

export const ConversationThreadContent = (props: ConversationThreadContentProps) => {
  const {
    thread,
    hasMore,
    messages,
    isFetching,
    onEmailReply,
    onEmailForward,
    onEmailReplyAll,
    onFetchMoreData,
  } = props;

  const timeViewRef = useRef<HTMLParagraphElement>();
  const flexDirection = thread?.sender.channel_name === 'email' ? 'column' : 'column-reverse';

  if (isFetching) {
    return <FullPageSpinner />;
  }

  return (
    <Flex flex={1} overflowY="hidden" flexDirection="column">
      <Flex
        pt="0"
        flex={1}
        overflowY="scroll"
        className="thread"
        flexDirection={flexDirection}
        id="message-thread-scrollable"
      >
        <InfiniteScroll
          inverse={true}
          hasMore={hasMore ?? false}
          next={() => onFetchMoreData?.()}
          dataLength={messages?.length ?? 0}
          endMessage={<BodyText></BodyText>}
          scrollableTarget="message-thread-scrollable"
          style={{ display: 'flex', flexDirection, paddingBottom: '.75rem' }}
          loader={
            <Flex my="1rem" alignItems="center" justifyContent="center" paddingTop="2rem">
              <Spinner color="blue.500" size="md" />
            </Flex>
          }
        >
          {messages?.map((message, index) => (
            <Box mt="1rem" key={message.uuid}>
              <Chatbubble
                thread={thread}
                message={message}
                timeViewRef={timeViewRef}
                receiver={thread?.receiver}
                onEmailReply={onEmailReply}
                onEmailForward={onEmailForward}
                onEmailReplyAll={onEmailReplyAll}
                emailBubbleDefaultIndex={[index]}
              />
            </Box>
          ))}
        </InfiniteScroll>
      </Flex>
    </Flex>
  );
};
