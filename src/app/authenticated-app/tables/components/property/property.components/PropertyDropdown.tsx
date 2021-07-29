import { Divider, Popover, PopoverTrigger } from '@chakra-ui/core';
import * as React from 'react';
import { PopoverContentCard } from '../../../../../components';
import { PropertyDropdownProps } from '../property.types';
import { PropertyActionButton } from './PropertyActionButton';
import { PropertyForm } from './PropertyForm';

export function PropertyDropdown({
  children,
  property,
  onDelete,
  onChange,
  onDuplicate,
  usePortal,
  placement,
}: PropertyDropdownProps) {
  return (
    <Popover usePortal={usePortal} placement={placement}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContentCard position="absolute" width="fit-content">
        <PropertyForm onChange={onChange} property={property} />
        {property && (
          <>
            <Divider borderColor="gray.100" />
            {onDuplicate && (
              <PropertyActionButton icon="duplicate" onClick={() => onDuplicate && onDuplicate()}>
                Duplicate
              </PropertyActionButton>
            )}
            {onDelete && (
              <PropertyActionButton icon="delete" onClick={() => onDelete && onDelete()}>
                Delete
              </PropertyActionButton>
            )}
          </>
        )}
      </PopoverContentCard>
    </Popover>
  );
}
