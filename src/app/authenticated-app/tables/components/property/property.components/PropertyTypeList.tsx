import { List } from '@chakra-ui/core';
import * as React from 'react';
import { PROPERTIES } from '../property.data';
import { PropertyTypeListProps } from '../property.types';
import { PropertyTypeItem } from './PropertyTypeItem';

export function PropertyTypeList({
  properties = PROPERTIES,
  onClick,
}: PropertyTypeListProps) {
  return (
    <List spacing="20px">
      {properties.map((item, index) => (
        <PropertyTypeItem {...item} key={index} onClick={onClick} />
      ))}
    </List>
  );
}
