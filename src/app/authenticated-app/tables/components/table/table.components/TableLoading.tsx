import * as React from 'react';
import { Stack, Spinner, Text } from '@chakra-ui/core';

export function TableLoading() {
  return (
    <Stack tabIndex={-1} isInline alignItems="center">
      <Spinner size="sm" speed="0.5s" color="blue.500" emptyColor="gray.200" />
      <Text fontSize="0.875rem">Loading...</Text>
    </Stack>
  );
}
