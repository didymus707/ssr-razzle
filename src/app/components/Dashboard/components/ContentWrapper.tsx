import React from 'react';
import { Box, BoxProps } from '@chakra-ui/core';

export type ContentWrapperProps = { children: React.ReactNode } & BoxProps;

export const ContentWrapper = ({ children, ...rest }: ContentWrapperProps) => {
  return (
    <Box width="100%" height="100vh" overflowY="auto" backgroundColor="white" {...rest}>
      {children}
    </Box>
  );
};
