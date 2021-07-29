import { Flex, Image, Text } from '@chakra-ui/core';
import React from 'react';
import noSearch from '../../no-search.svg';
import { ConversationList } from './ConversationList';

export function SearchResult({ searchQuery, searchedResult }: any) {
  const searchResults: string[] = Object.values(
    searchedResult as { [k: string]: string[] } || ({} as { [k: string]: string[] })
  ).flat();

  return searchResults.length === 0 ? (
    <Flex
      display="flex"
      textAlign="center"
      alignItems="center"
      paddingTop="1.25rem"
      justifyContent="center"
      flexDirection="column"
      color="rgb(0, 0, 0, 0.5)"
      borderTop="solid 1px #e9edf0"
    >
      <Image src={noSearch} width="80px" />
      <Text>No Result Found</Text>
      <Text
        fontSize=".75rem"
        marginTop=".25rem"
      >{`We couldn't find any matches for "${searchQuery}"`}</Text>
    </Flex>
  ) : (
    <Flex flex={1} overflowY="auto" flexDirection="column">
      <ConversationList heading="search" list={searchedResult && searchedResult.threads} />
    </Flex>
  );
}
