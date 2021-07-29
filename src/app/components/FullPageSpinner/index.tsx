import * as React from 'react';
import { Box, Spinner, BoxProps } from '@chakra-ui/core';

export function FullPageSpinner(props: BoxProps) {
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <Spinner
        size="md"
        speed="0.9s"
        thickness="3px"
        color="blue.500"
        emptyColor="gray.200"
      />
    </Box>
  );
}
