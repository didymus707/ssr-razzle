import React, { useState } from 'react';
import { Flex } from '@chakra-ui/core';
import { ChatProps, ConversationProps } from '../../inbox.types';
import { Chat } from './Chat';
import { Header } from './Header';
import { ConnectionWarningPrompt } from './ConnectionWarningPrompt';

export function Conversation({
  toggleResolve,
  setToggleResolve,
  textAreaRef,
  setErrorData,
  ...rest
}: ConversationProps & { setErrorData: any }) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchedResult, setSearchedResult] = useState<ChatProps['searchedResult']>();

  return (
    <Flex
      width="20.5rem"
      maxWidth="20.5rem"
      flexDirection="column"
      borderLeft="solid 1px rgba(213, 219, 230, 0.5)"
      {...rest}
    >
      <ConnectionWarningPrompt />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSearchedResult={setSearchedResult}
      />

      <Chat
        flex={1}
        searchedResult={searchedResult}
        searchQuery={searchQuery}
        toggleResolve={toggleResolve}
        setToggleResolve={setToggleResolve}
      />
    </Flex>
  );
}
