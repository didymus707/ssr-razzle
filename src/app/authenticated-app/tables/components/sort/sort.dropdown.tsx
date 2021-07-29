import { Box, Button, Popover, PopoverTrigger } from '@chakra-ui/core';
import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { PopoverContentCard } from '../../../../components';
import { SortItem } from './sort.item';
import {
  SortDropdownProps,
  SortItemOptions,
  SortListProps,
} from './sort.types';

export const SortList = SortableContainer(
  ({ sortList, onChange, onRemove, properties }: SortListProps) => {
    return (
      <div>
        {[...sortList].map((value: SortItemOptions, index: number) => (
          <SortItem
            value={value}
            index={index}
            properties={properties}
            key={`sort-${index}-${value.name}`}
            onRemove={() => onRemove && onRemove(index)}
            onChange={(value) => onChange && onChange(value, index)}
          />
        ))}
      </div>
    );
  }
);

export function SortDropdown({
  actions,
  sortList,
  children,
  properties,
}: SortDropdownProps) {
  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContentCard title="Sort" padding="1rem" width="20rem">
        <Box marginTop="0.5rem">
          <SortList
            lockAxis="y"
            useDragHandle
            sortList={sortList}
            properties={properties}
            onChange={actions.update}
            onRemove={actions.remove}
            onSortEnd={actions.reorder}
          />
        </Box>
        <Button
          size="xs"
          width="auto"
          variant="ghost"
          leftIcon="small-add"
          onClick={actions.add}
        >
          Add a sort
        </Button>
      </PopoverContentCard>
    </Popover>
  );
}
