import { Box, Flex, PseudoBox, Switch, Text } from '@chakra-ui/core';
import * as React from 'react';
import { SortableElement } from 'react-sortable-hoc';
import { DragHandle } from '../../../../../components';
import { PropertyProps } from '../property.types';
import { PropertyDropdown } from './PropertyDropdown';

export const Property = SortableElement(
  ({
    id,
    name,
    type,
    label,
    hidden,
    options,
    onChange,
    onDelete,
    onDuplicate,
  }: PropertyProps) => {
    const [isHidden, setIsHidden] = React.useState<boolean>(hidden);
    const property = { id, name, type, label, options, hidden };

    function handleHiddenSwitch(e: React.ChangeEvent<HTMLInputElement>) {
      const checked = e.target.checked;

      setIsHidden(!checked);
      onChange &&
        onChange({
          ...property,
          hidden: !checked,
        });
    }

    return (
      <PropertyDropdown
        onChange={onChange}
        onDelete={onDelete}
        property={property}
        onDuplicate={onDuplicate}
      >
        <PseudoBox
          as="button"
          width="100%"
          display="flex"
          paddingX="1rem"
          paddingY="0.2rem"
          zIndex={100000000}
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
        >
          <Box>
            <DragHandle />
          </Box>
          <Flex paddingLeft="0.5rem" flex={1} justifyContent="space-between">
            <Text fontSize="14px">{label}</Text>
            <Switch
              size="sm"
              aria-label="hidden"
              marginLeft="0.5rem"
              isChecked={!isHidden}
              onChange={handleHiddenSwitch}
            />
          </Flex>
        </PseudoBox>
      </PropertyDropdown>
    );
  }
);
