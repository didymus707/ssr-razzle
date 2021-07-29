import * as React from 'react';
import { Heading, Flex, Box, BoxProps } from '@chakra-ui/core';

export function PageHeader({
  title,
  children,
  ...props
}: BoxProps & {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Flex
      padding="1rem"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="space-between"
      {...props}
    >
      <Box paddingBottom="0.5rem">
        <Heading as="h4" fontSize="1.125rem" fontWeight={500} color="#212121">
          {title}
        </Heading>
      </Box>
      <Box width={['100%', 'auto', 'auto', 'auto']}>{children}</Box>
    </Flex>
  );
}
