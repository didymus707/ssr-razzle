import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import * as React from 'react';
import { PropertyTypeProps } from '../property.types';
import { PropertyTypeList } from './PropertyTypeList';

export function PropertyType({ children, onChange }: PropertyTypeProps) {
  return (
    <Popover placement="right-end" trigger="hover">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent border="0" width="fit-content" zIndex={1500}>
        <PropertyTypeList onClick={onChange} />
      </PopoverContent>
    </Popover>
  );
}
