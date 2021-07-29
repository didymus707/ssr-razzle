import * as React from 'react';
import { Box, BoxProps } from '@chakra-ui/core';

export function HomeCard({
  children,
  ...props
}: BoxProps & { children: React.ReactNode }) {
  return (
    <Box
      height="auto"
      margin="auto"
      boxShadow="md"
      maxWidth="758px"
      borderRadius="5px"
      padding="1rem 1.5rem"
      marginTop={props.marginTop}
      marginBottom={props.marginBottom}
      // boxShadow="0 0 1px 0 rgba(67, 90, 111, 0.9)"
    >
      {children}
    </Box>
  );
}
