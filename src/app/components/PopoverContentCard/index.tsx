import { BoxProps, Flex, Icon, PopoverContent, Text } from '@chakra-ui/core';
import * as React from 'react';

interface PopoverContentCardProps {
  children?: React.ReactNode;
  icon?: string;
  title?: string;
}

type Props = PopoverContentCardProps & BoxProps;

export function PopoverContentCard({ icon, title, children, ...props }: Props) {
  return (
    <PopoverContent border="0" zIndex={99999} {...props}>
      <Flex alignItems="center">
        {icon && <Icon size="0.75rem" name={icon} />}
        {title && (
          <Text fontSize="14px" fontWeight={500} paddingLeft="0.5rem">
            {title}
          </Text>
        )}
      </Flex>
      {children}
    </PopoverContent>
  );
}
