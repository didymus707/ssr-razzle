import {
  Box,
  Text,
  Flex,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Icon,
} from '@chakra-ui/core';
import * as React from 'react';
import {
  PropertiesList,
  PropertyDropdown,
  PropertySearchForm,
} from './property.components';
import { PropertiesDropdownProp, PropertySchema } from './property.types';

export function PropertiesDropdown({
  children,
  properties,
  onPropertyAdd,
  onPropertyDrag,
  onPropertyDelete,
  onPropertyUpdate,
  onPropertyDuplicate,
}: PropertiesDropdownProp) {
  const [list, setList] = React.useState<PropertySchema[]>(properties || []);

  React.useEffect(() => {
    setList(properties);
  }, [properties]);

  function handleSearch(value: string) {
    if (value) {
      const newList = list.filter((item) =>
        item.name.toLowerCase().startsWith(value.toLowerCase())
      );
      if (newList.length) {
        setList(newList);
      } else {
        setList(properties);
      }
    } else {
      setList(properties);
    }
  }

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent zIndex={99999} paddingY="1rem" width="fit-content">
        <Flex paddingX="1rem" alignItems="center">
          <Icon size="0.75rem" name="filter" />
          <Text fontSize="14px" fontWeight={500} paddingLeft="0.5rem">
            Properties
          </Text>
        </Flex>
        <Box paddingX="1rem">
          <PropertySearchForm onChange={handleSearch} />
        </Box>
        <PropertiesList
          lockAxis="y"
          useDragHandle
          properties={list}
          onSortEnd={onPropertyDrag}
          onChange={onPropertyUpdate}
          onDelete={onPropertyDelete}
          onDuplicate={onPropertyDuplicate}
        />
        <Box paddingX="1rem" paddingTop="0.5rem">
          <PropertyDropdown onChange={onPropertyAdd}>
            <Button leftIcon="add" size="xs" width="100%" fontWeight="normal">
              New property
            </Button>
          </PropertyDropdown>
        </Box>
      </PopoverContent>
    </Popover>
  );
}
