import React from 'react';
import { Box } from '@chakra-ui/core';

export function DecorativeCard({ children }: { children?: React.ReactNode }) {
  return (
    <Box
      padding="3rem"
      borderRadius="5px"
      position="relative"
      background="#2034c5"
    >
      {children}
      <Box
        left="5%"
        top="-10px"
        width="90%"
        height="10px"
        zIndex={1000}
        opacity={0.52}
        margin="0 auto"
        position="absolute"
        background="#2034c5"
        roundedTopLeft="5px"
        roundedTopRight="5px"
      />
    </Box>
  );
}
