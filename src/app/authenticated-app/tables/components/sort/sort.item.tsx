import * as React from 'react';
import {
  Box,
  List,
  Stack,
  Button,
  Popover,
  ListItem,
  ListIcon,
  IconButton,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/core';
import { SortableElement } from 'react-sortable-hoc';
import {
  SortItemProps,
  SortItemOptions,
  SortItemOrderProps,
  SortItemPropertyNameProps,
} from './sort.types';
import { SORT_ORDER_LIST } from './sort.data';
import { PROPERTIES } from '../property';
import { DragHandle } from '../../../../components';
import { objectIsEmpty } from '../../../../../utils';
import { SelectOptions } from '../../tables.types';

export function SortItemOrder({
  value,
  options,
  onSelect,
}: SortItemOrderProps) {
  const option = options.find((item) => item.value === value) as SelectOptions;

  function handleSelect(option: SelectOptions) {
    onSelect(option.value);
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          size="sm"
          width="100%"
          variant="outline"
          rightIcon="chevron-down"
        >
          {option.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent zIndex={1000} paddingY="0.5rem" width="fit-content">
        <List>
          {options.map((option, index) => (
            <ListItem
              key={index}
              paddingX="1rem"
              cursor="pointer"
              paddingY="0.4rem"
              fontSize="0.75rem"
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </ListItem>
          ))}
        </List>
      </PopoverContent>
    </Popover>
  );
}

export function SortItemPropertyName({
  value,
  options,
  onSelect,
}: SortItemPropertyNameProps) {
  const option = options.find((item) => item.value === value) as SelectOptions;

  function handleSelect(option: SelectOptions) {
    onSelect(option.value);
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          size="sm"
          width="100%"
          variant="outline"
          rightIcon="chevron-down"
        >
          {option.label}
        </Button>
      </PopoverTrigger>
      <PopoverContent zIndex={1000} paddingY="0.5rem" width="fit-content">
        <List>
          {options.map((option, index) => (
            <ListItem
              key={index}
              paddingX="1rem"
              cursor="pointer"
              paddingY="0.4rem"
              fontSize="0.75rem"
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleSelect(option)}
            >
              <ListIcon size="0.75rem" icon={option.icon} />
              {option.label}
            </ListItem>
          ))}
        </List>
      </PopoverContent>
    </Popover>
  );
}

export const SortItem = SortableElement(
  ({ value, onChange, onRemove, properties }: SortItemProps) => {
    const SORT_PROPERTIES = properties.map((property) => {
      const selectProperty = PROPERTIES.find(
        (item) => item.label.toLowerCase() === property.type.toLowerCase()
      );
      const propertyIcon = selectProperty && selectProperty.icon;
      return {
        label: property.label,
        value: property.name,
        icon: propertyIcon,
      };
    });
    const initialValue = objectIsEmpty(value)
      ? {
          name: SORT_PROPERTIES[0].value,
          order: SORT_ORDER_LIST[0].value,
        }
      : value;
    const [sortItem, setSortItem] = React.useState<SortItemOptions | null>(
      initialValue
    );

    function handleSortItemOrderChange(order: string) {
      const value = { ...sortItem, order };
      setSortItem(value);
      onChange(value);
    }

    function handleSortItemNameChange(name: string) {
      const value = { ...sortItem, name };
      setSortItem(value);
      onChange(value);
    }

    return (
      <Stack
        isInline
        zIndex={1000000}
        spacing="0.25rem"
        alignItems="center"
        marginBottom="0.5rem"
      >
        <Box>
          <DragHandle />
        </Box>
        <Box flex={1}>
          <SortItemPropertyName
            options={SORT_PROPERTIES}
            value={sortItem && sortItem.name}
            onSelect={handleSortItemNameChange}
          />
        </Box>
        <Box flex={1}>
          <SortItemOrder
            options={SORT_ORDER_LIST}
            value={sortItem && sortItem.order}
            onSelect={handleSortItemOrderChange}
          />
        </Box>
        <Box>
          <IconButton
            size="xs"
            icon="close"
            fontSize="8px"
            variant="ghost"
            aria-label="close"
            onClick={onRemove}
          />
        </Box>
      </Stack>
    );
  }
);
