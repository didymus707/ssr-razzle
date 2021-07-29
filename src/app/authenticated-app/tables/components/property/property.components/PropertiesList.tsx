import { Box, List } from '@chakra-ui/core';
import * as React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { PropertySchema } from '../property.types';
import { Property } from './Property';

export const PropertiesList = SortableContainer(
  ({
    onDelete,
    onChange,
    properties,
    onDuplicate,
  }: {
    properties: PropertySchema[];
    onDelete?: (index: number) => void;
    onDuplicate?: (property: PropertySchema) => void;
    onChange?: (property: PropertySchema, index: number) => void;
  }) => {
    return (
      <Box>
        <List>
          {properties.map((item, index) => (
            <Property
              {...item}
              index={index}
              key={`${item.name}-${index}`}
              onDelete={() => onDelete && onDelete(index)}
              onDuplicate={() => onDuplicate && onDuplicate(item)}
              onChange={(property) => onChange && onChange(property, index)}
            />
          ))}
        </List>
      </Box>
    );
  }
);
