import * as React from 'react';
import { Box, BoxProps } from '@chakra-ui/core';

export const Dashboard = ({
  theme,
  children,
  ...rest
}: {
  theme?: any;
  children: React.ReactNode;
} & BoxProps) => {
  return (
    <Box {...rest}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { theme });
        }
      })}
    </Box>
  );
};
