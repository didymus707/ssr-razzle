import * as React from 'react';
import { Flex, Icon, Stack, Text } from '@chakra-ui/core';
import { TableInstance } from 'react-table';

export function TemplateTablePagination<T extends object>({
  instance,
}: React.PropsWithChildren<{
  instance: TableInstance<T | {}>;
}>): React.ReactElement {
  const {
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    state: { pageIndex },
  } = instance;
  return (
    <Flex width="fit-content" margin="3rem auto" alignItems="center">
      <Flex alignItems="center">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          <Stack isInline alignItems="center">
            <Icon name="chevron-left" />
            <Text fontSize="sm" opacity={Number(0.2)} fontWeight="medium">
              Prev
            </Text>
          </Stack>
        </button>
      </Flex>
      <Flex
        margin="0 0.5rem"
        background="#eee"
        borderRadius="2px"
        padding="0.09rem 0.2rem"
        alignItems="center"
      >
        <Text color="#6554c0" fontWeight="medium" fontSize="0.7rem">
          {pageIndex + 1}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          <Stack isInline alignItems="center">
            <Icon name="chevron-right" />
            <Text fontSize="sm" opacity={Number(0.2)} fontWeight="medium">
              Next
            </Text>
          </Stack>
        </button>
      </Flex>
    </Flex>
  );
}
