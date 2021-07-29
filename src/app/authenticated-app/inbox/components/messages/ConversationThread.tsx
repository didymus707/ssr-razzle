import { Flex, Image, Stack, useDisclosure } from '@chakra-ui/core';
import { AxiosError } from 'axios';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getThreadByID } from '../../inbox.service';
import { ThreadSchema, TwoWayPayloadSchema } from '../../inbox.types';
import { ConversationFiltersProps } from '../filters';
import noConversationImage from '../no-conversation.svg';
import { useInbox } from '../Provider';
import {
  ConversationThreadContent,
  ConversationThreadContentProps,
} from './ConversationThreadContent';
import { ConversationThreadFooter } from './ConversationThreadFooter';
import {
  ConversationThreadHeader,
  ConversationThreadHeaderProps,
} from './ConversationThreadHeader';
import { ThreadStarter } from './ThreadStarter';

export type ConversationThreadUIProps = ConversationThreadHeaderProps &
  ConversationThreadContentProps &
  Pick<ConversationFiltersProps, 'channels'> & {
    setActiveFilter?: () => void;
    setActiveThread?: React.Dispatch<React.SetStateAction<ThreadSchema | undefined>>;
  };

export const ConversationThread = (props: ConversationThreadUIProps) => {
  const {
    tags,
    hasMore,
    messages,
    channels,
    isFetching,
    setActiveFilter,
    onFetchMoreData,
    setActiveThread,
    thread: threadProps = {} as ThreadSchema,
  } = props;

  const { isNewConversation } = useInbox();
  const {
    isOpen: showEmailCompose,
    onOpen: onOpenEmailCompose,
    onClose: onCloseEmailCompose,
  } = useDisclosure();

  const [text, setText] = useState('');
  const [lastMessage, setLastMessage] = useState(threadProps.last_message);
  const [shouldShowStarterCompose, setShouldShowStarterCompose] = useState(false);
  const [twoWayPayload, setTwoWayPayload] = useState<TwoWayPayloadSchema>({
    senderPlatformNick: '',
  });

  const { data: thread } = useQuery<ThreadSchema, AxiosError>(
    ['threads', threadProps.uuid],
    () => getThreadByID({ thread_id: threadProps.uuid }),
    {
      initialData: threadProps,
      enabled: !!threadProps.uuid,
    },
  );

  const handleTextChange = (text: string, isTemplateMode?: boolean) => {
    setText(text);
  };

  const handleEmailReply = (message: any) => {
    onOpenEmailCompose();
    setLastMessage(message);
  };

  const handleEmailReplyAll = (message: any) => {
    onOpenEmailCompose();
    setLastMessage(message);
  };

  const handleEmailForward = (message: any) => {
    onOpenEmailCompose();
    setLastMessage(message);
  };

  return isNewConversation ? (
    <>
      <ThreadStarter
        flex="1"
        text={text}
        channels={
          channels?.filter(
            (channel: any) =>
              channel.user.channel_name === 'email' || channel.user.channel_name === 'phone',
          ) ?? []
        }
        setText={handleTextChange}
        twoWayPayload={twoWayPayload}
        setActiveFilter={setActiveFilter}
        setActiveThread={setActiveThread}
        setTwoWayPayload={setTwoWayPayload as any}
        showCompose={shouldShowStarterCompose}
        setShowCompose={setShouldShowStarterCompose}
      />
    </>
  ) : (
    <Stack pt="1.5rem" px="1.5rem" bg="white" height="calc(100vh - 60px)" flex={1}>
      {thread?.state === 'queued' || isEmpty(thread) ? (
        <Flex height="100%" justifyContent="center" alignItems="center">
          <Image src={noConversationImage} size="15rem" />
        </Flex>
      ) : (
        <>
          <ConversationThreadHeader
            tags={tags}
            thread={thread}
            lastMessage={threadProps?.last_message}
          />
          <ConversationThreadContent
            {...{
              thread,
              hasMore,
              messages,
              isFetching,
              onFetchMoreData,
              onEmailReply: handleEmailReply,
              onEmailForward: handleEmailForward,
              onEmailReplyAll: handleEmailReplyAll,
            }}
          />
          {thread?.state !== 'resolved' && (
            <ConversationThreadFooter
              thread={thread}
              lastMessage={lastMessage}
              twoWayPayload={twoWayPayload}
              showEmailCompose={showEmailCompose}
              onCloseEmailCompose={onCloseEmailCompose}
              setTwoWayPayload={setTwoWayPayload as any}
            />
          )}
        </>
      )}
    </Stack>
  );
};

// import {
//   Badge,
//   Box, Flex, IconButton, Spinner, Text
// } from '@chakra-ui/core';
// import React, { createRef, RefObject, useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useHistory, useParams } from 'react-router-dom';
// import InfiniteScroll from "react-infinite-scroll-component";
// import { RootState } from '../../../../../root';
// import { selectOrganisationID, selectUserID } from '../../../../unauthenticated-app/authentication';
// import { INBOX_INIT } from '../../inbox.data';
// import { ConversationThreadProps } from '../../inbox.types';
// import {
//   fetchThreadMessages, selectFirstUnreadMessageID, selectLoadingMessageIDs, selectMessageMeta,
//   selectScrollTop, selectThreadDetailByID, selectThreadMessageIDs, selectThreadUnreadCount, updateScrollTop
// } from '../../slices';
// import { LoadingMessageItem } from './LoadingMessageItem';
// import { MessageItem } from './MessageItem';

// export function ConversationThread({ threadRef, ...rest }: ConversationThreadProps) {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const params = useParams<{ id: string }>();
//   const paramsID = params.id === 'new' ? '' : params.id;
//   const currentThread = useSelector(
//     (state: RootState) => selectThreadDetailByID(state, paramsID)
//   ) || INBOX_INIT.thread;

//   const scrollTop = useSelector(
//     (state: RootState) => selectScrollTop(state, { thread_id: paramsID })
//   ) || 0;

//   const { uuid: currentThreadID } = currentThread;
//   const user_id = useSelector(selectUserID);
//   const organisation_id = useSelector(selectOrganisationID);

//   const threadMessageIDs = useSelector(
//     (state: RootState) => selectThreadMessageIDs(state, currentThreadID)
//   );

//   const lastMessageRef = useRef<HTMLDivElement>(null);
//   const messageItemRefs = threadMessageIDs.reduce(
//     (acc: { [k: string]: RefObject<HTMLElement> }, item, index) => {
//       if (item) {
//         if (index === threadMessageIDs.length - 1) {
//           acc[item] = lastMessageRef;
//         } else {
//           acc[item] = createRef<HTMLElement>();
//         }
//       }

//       return acc;
//     },
//     {},
//   );

//   const loadingMessageIDs = useSelector(
//     (state: RootState) => selectLoadingMessageIDs(state, { thread_id: paramsID })
//   );
//   const messageIDs = [
//     ...loadingMessageIDs.map(id => ({ id, isLoading: true })),
//     ...threadMessageIDs.map(id => ({ id, isLoading: false })),
//   ].flat();

//   const threadMessageMeta = useSelector(
//     (state: RootState) => selectMessageMeta(state, { thread_id: currentThreadID })
//   );
//   const [hasMore, setHasMore] = useState(true);
//   const [isScrollBtnDisplayed, setIsScrollBtnDisplayed] = useState(false);

//   const threadMessageUnreadCount = useSelector(
//     (state: RootState) => selectThreadUnreadCount(state, {
//       thread_id: currentThreadID, author_id: user_id || ''
//     })
//   ) || 0;

//   const firstUnreadMessgeID = useSelector(
//     (state: RootState) => selectFirstUnreadMessageID(state, { thread_id: currentThreadID })
//   );

//   const fetchMoreData = () => {
//     const { count = 0, page = 0 } = threadMessageMeta.meta || {};
//     if (count !== 0 && Math.ceil((count / 15) - page) === 0) {
//       return setHasMore(false);
//     }

//     return currentThreadID && currentThreadID !== 'start' && !currentThreadID.includes('unknown') && user_id
//       && organisation_id && dispatch(fetchThreadMessages({
//         page: page + 1,
//         thread_id: currentThreadID,
//       }));
//   }

//   const handleOnScroll = (st: number) => {
//     if (threadRef && threadRef.current && lastMessageRef && lastMessageRef.current) {
//       threadRef.current.dataset.scrollTop = st.toString();
//       threadRef.current.dataset.currentThreadID = currentThreadID;

//       const diff = lastMessageRef.current.scrollHeight + (st || 0);

//       setIsScrollBtnDisplayed(diff <= 0);
//     }
//   }

//   const handleScrollBtnClick = () => {
//     if (threadMessageUnreadCount > 0) {
//       if (firstUnreadMessgeID) {
//         const view = messageItemRefs[firstUnreadMessgeID || ''];
//         if (view && view.current) {
//           view.current.scrollIntoView({
//             behavior: 'smooth',
//             block: 'center',
//           });
//         }
//       }
//     } else if (threadRef && threadRef.current) {
//       threadRef.current.scrollTop = 0;
//     }
//   };

//   // const [forceRerender, setForceRerender] = useState(0);
//   // manage scroll
//   useEffect(() => {
//     if (threadRef && threadRef.current) {
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//       const { scrollHeight, clientHeight } = threadRef.current;
//       const diff = scrollTop + scrollHeight;

//       // if (forceRerender > 0 && scrollHeight === clientHeight) {
//       //   return setForceRerender(0);
//       // }

//       if (diff < 0) {
//         // const nextForceRerender = forceRerender + 1;
//         // threadRef.current.scrollTop = -(nextForceRerender * clientHeight);
//         // return setForceRerender(nextForceRerender);
//       }

//       threadRef.current.scrollTop = 0;
//       // if (forceRerender !== 0) {
//       //   setForceRerender(0);
//       // }
//     }
//     // }, [paramsID, scrollTop, forceRerender]);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [paramsID, scrollTop]);

//   // fetch the conversation messages
//   useEffect(() => {
//     setHasMore(true);
//     fetchMoreData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentThreadID]);

//   useEffect(() => {
//     return history.listen(() => {
//       if (threadRef?.current) {
//         const {
//           scrollTop: trScrollTop = '0', currentThreadID: trCurrentThreadID = ''
//         } = threadRef.current.dataset || {};
//         const scrollTop = Number(trScrollTop);

//         if (trCurrentThreadID && scrollTop < 0) {
//           dispatch(updateScrollTop({ thread_id: trCurrentThreadID, scrollTop }));
//         }

//         threadRef.current.dataset.scrollTop = '0';
//       }
//     })
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [history]);

//   return (
//     <Flex
//       overflowY="hidden"
//       flexDirection="column"
//       {...rest}
//     >
//       <Flex
//         flexDirection="column-reverse"
//         overflowY="scroll"
//         flex={1}
//         className="thread"
//         id="message-thread-scrollable"
//         pt="0"
//         px={['1rem', '1rem', '2.5rem', '2.5rem']}
//         ref={threadRef}
//         onScroll={(e: any) => handleOnScroll(e.target.scrollTop)}
//       >
//         <InfiniteScroll
//           dataLength={messageIDs.length}
//           next={fetchMoreData}
//           style={{ display: 'flex', flexDirection: 'column-reverse', paddingBottom: '.75rem' }}
//           inverse={true}
//           hasMore={hasMore}
//           loader={(
//             <Box textAlign="center" paddingTop="2rem">
//               <Spinner color="blue.500" size="md" />
//             </Box>
//           )}
//           scrollableTarget="message-thread-scrollable"
//         >
//           {messageIDs.map(({ id, isLoading }, index) => (
//             <Box key={id} width="100%" marginTop="1rem" ref={messageItemRefs[id]}>
//               {id === threadMessageMeta.firstUnreadMessageID && index !== 0 && (
//                 <Flex marginY="1rem" alignItems="center">
//                   <Box height="1px" backgroundColor="#E2E8F0" flex={1} />
//                   <Text marginX="0.5rem" fontSize=".75rem" fontStyle="italic" color="red.500">New</Text>
//                   <Box height="1px" backgroundColor="#E2E8F0" flex={1} />
//                 </Flex>
//               )}

//               {isLoading ? (
//                 <LoadingMessageItem
//                   messageRef={messageItemRefs[id]}
//                   previousItemID={threadMessageIDs[index - 1]}
//                   nextItemID={threadMessageIDs[index + 1]}
//                   threadSenderID={currentThread.sender_id}
//                   itemID={id}
//                 />
//               ) : (
//                 <MessageItem
//                   messageRef={messageItemRefs[id]}
//                   previousItemID={threadMessageIDs[index - 1]}
//                   nextItemID={threadMessageIDs[index + 1]}
//                   itemID={id}
//                   threadSenderID={currentThread.sender_id}
//                 />
//               )}
//             </Box>
//           ))}
//         </InfiniteScroll>

//         {isScrollBtnDisplayed && (
//           <Box
//             position="absolute"
//             bottom="6rem"
//             right={['1rem', '1rem', '2.5rem', '2.5rem']}
//           >
//             <IconButton
//               aria-label="scroll down"
//               icon="arrow-down"
//               size="md"
//               borderRadius="50%"
//               onClick={handleScrollBtnClick}
//             />

//             {threadMessageUnreadCount > 0 && (
//               <Badge
//                 variant="solid"
//                 variantColor="blue"
//                 borderRadius="50%"
//                 position="absolute"
//                 left="-.25rem"
//               >
//                 {threadMessageUnreadCount}
//               </Badge>
//             )}
//           </Box>
//         )}
//       </Flex>
//     </Flex>
//   );
// }
