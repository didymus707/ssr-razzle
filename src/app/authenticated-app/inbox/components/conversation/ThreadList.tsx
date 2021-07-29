import { Box, Flex, Image, Skeleton, Spinner, Stack } from '@chakra-ui/core';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThreadItem } from './ThreadItem';
import emptyViewImage from '../no-thread.svg';
import { BodyText } from 'app/components';

export type ThreadListProps = {
  threads: any[];
  hasMore?: boolean;
  activeThread?: any;
  isFetching?: boolean;
  onFetchMoreData?(): void;
  onThreadItemClick?(thread: any): void;
  onThreadItemAssign?(thread?: any): void;
};

export const ThreadList = (props: ThreadListProps) => {
  const {
    threads,
    hasMore,
    activeThread,
    isFetching,
    onFetchMoreData,
    onThreadItemAssign,
    onThreadItemClick,
  } = props;

  if (isFetching) {
    return (
      <Stack>
        {Array.from({ length: 15 }, (v, i) => (
          <Box
            py="0.5rem"
            px="0.75rem"
            borderBottomWidth="1px"
            key={`${i.toString()}-${new Date().getTime()}`}
          >
            <Skeleton height="10px" width="80%" my="10px" />
            <Skeleton height="10px" my="10px" />
          </Box>
        ))}
      </Stack>
    );
  }

  return !!threads.length ? (
    <InfiniteScroll
      hasMore={hasMore ?? false}
      dataLength={threads.length}
      style={{ overflow: 'hidden' }}
      next={() => onFetchMoreData?.()}
      loader={
        <Flex alignItems="center" justifyContent="center" paddingTop="2rem">
          <Spinner color="blue.500" size="md" />
        </Flex>
      }
      endMessage={
        <Flex alignItems="center" justifyContent="center" paddingTop="2rem">
          <BodyText>~ All loaded ~</BodyText>
        </Flex>
      }
      scrollableTarget="scrollableDiv"
    >
      <Stack spacing="0">
        {threads.map(thread => (
          <Box key={thread.uuid}>
            <ThreadItem
              thread={thread}
              onClick={onThreadItemClick}
              onAssign={onThreadItemAssign}
              isActive={activeThread?.uuid === thread.uuid}
            />
          </Box>
        ))}
      </Stack>
    </InfiniteScroll>
  ) : (
    <Flex height="100%" justifyContent="center" alignItems="center">
      <Image src={emptyViewImage} size="4rem" />
    </Flex>
  );
};
