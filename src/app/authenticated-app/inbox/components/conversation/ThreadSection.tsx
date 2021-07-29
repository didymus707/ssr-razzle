import { Box } from '@chakra-ui/core';
import { Heading3 } from 'app/components';
import React from 'react';
import { FilterTypeOptions, UserChannelSchema } from '../../inbox.types';
import { ConversationFiltersProps } from '../filters';
import { useInbox } from '../Provider';
import { ConnectionWarningPrompt } from './ConnectionWarningPrompt';
import { InboxSearch, InboxSearchProps } from './InboxSearch';
import { ThreadList, ThreadListProps } from './ThreadList';

export type ThreadSectionProps = ThreadListProps &
  Pick<InboxSearchProps, 'onSearch' | 'isSearching'> &
  Pick<ConversationFiltersProps, 'tags' | 'activeFilter'> & {
    credentialsWithIssue?: UserChannelSchema[];
    threadTypes?: { [key: string]: FilterTypeOptions };
  };

export const ThreadSection = (props: ThreadSectionProps) => {
  const {
    tags,
    onSearch,
    isSearching,
    threadTypes,
    activeFilter,
    credentialsWithIssue,
    ...rest
  } = props;
  const { setIsNewConversation } = useInbox();

  const handleNewConversation = () => {
    setIsNewConversation(true);
  };

  return (
    <Box
      bg="white"
      height="100vh"
      width="370px"
      overflowY="auto"
      id="scrollableDiv"
      position="relative"
      borderRightWidth="1px"
    >
      <Box width="100%" px="0.75rem" bg="white" zIndex={2} pt="1.5rem">
        <Box pb="1.25rem">
          <InboxSearch
            onSearch={onSearch}
            isSearching={isSearching}
            onNewConversation={handleNewConversation}
          />
        </Box>
        <Heading3 pb="1.25rem" fontSize="1.25rem">
          {activeFilter ? threadTypes?.[activeFilter].children : ''}
        </Heading3>
      </Box>
      <ConnectionWarningPrompt credentialsWithIssue={credentialsWithIssue} />
      <Box height={!!rest.threads.length ? 'unset' : '100%'} px="0.75rem" pb="100px">
        <ThreadList {...rest} />
      </Box>
    </Box>
  );
};
