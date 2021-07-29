import * as React from 'react';
import { Box, Text, BoxProps } from '@chakra-ui/core';

type BottomCardProps = {
  label?: string;
};

export function BottomCard({
  label,
  children,
  ...props
}: BottomCardProps & BoxProps) {
  return (
    <Box
      padding="2rem"
      color="gray.500"
      background="#fff"
      letterSpacing="wide"
      marginBottom="0.5rem"
      boxShadow="0 9px 35px 4px rgba(0, 0, 0, 0.03)"
      {...props}
    >
      <Text fontSize="1.25rem" fontWeight="semibold" color="#212242">
        {label}
      </Text>
      {children}
    </Box>
  );
}
