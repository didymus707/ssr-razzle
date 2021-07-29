import * as React from 'react';
import { Tooltip, PseudoBox, Icon, Text } from '@chakra-ui/core';
import { PropertyItemProps } from '../property.types';

export function PropertyTypeItem({ icon, label, tooltip, onClick }: PropertyItemProps) {
  return (
    <Tooltip
      label={tooltip}
      zIndex={999999}
      aria-label="property"
      placement="right-end"
      aria-labelledby={tooltip}
    >
      <PseudoBox
        display="flex"
        paddingX="1rem"
        cursor="pointer"
        paddingY="0.5rem"
        alignItems="center"
        marginBottom="0.4rem"
        _hover={{ bg: 'gray.100' }}
        onClick={() => onClick && onClick(label)}
      >
        <Icon size="0.75rem" name={icon} />
        <Text fontSize="0.875rem" fontWeight="normal" marginLeft="0.4rem">
          {label}
        </Text>
      </PseudoBox>
    </Tooltip>
  );
}
