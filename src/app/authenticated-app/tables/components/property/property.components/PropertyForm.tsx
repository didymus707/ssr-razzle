import { Box, FormLabel, Icon, Input, InputProps, PseudoBox, Text } from '@chakra-ui/core';
import * as React from 'react';
import camelCase from 'lodash/camelCase';
import { PROPERTIES } from '../property.data';
import { PropertySchema, TypeProps } from '../property.types';
import { PropertyType } from './PropertyType';

const PropertyInput = React.forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  const { value, onBlur, onChange, ...rest } = props;
  return (
    <Input
      size="sm"
      ref={ref}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      marginBottom="1rem"
      placeholder="Enter property name"
      {...rest}
    />
  );
});

export function PropertyForm({
  onChange,
  property,
  firstFieldRef,
}: {
  property?: PropertySchema;
  firstFieldRef?: React.Ref<any>;
  onChange?: (property: PropertySchema) => void;
}) {
  const [name, setName] = React.useState(property ? property.label : '');
  const [type, setType] = React.useState(property ? property.type : '');
  const [activeType, setActiveType] = React.useState<TypeProps | undefined>();

  React.useEffect(() => {
    setActiveType(PROPERTIES.find(item => item.label.toLowerCase() === type.toLowerCase()));
  }, [type]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
  }

  function handleBlur() {
    if (name && type && onChange) {
      const data = {
        ...property,
        label: name,
        name: camelCase(name),
        type: type.toUpperCase(),
      } as PropertySchema;
      onChange(data);
    }
  }

  function handleTypeChange(value: string) {
    setType(value);
    if (name && onChange && value) {
      const data = {
        ...property,
        label: name,
        name: camelCase(name),
        type: value.toUpperCase(),
      } as PropertySchema;
      onChange(data);
    }
  }

  return (
    <Box>
      <Box paddingTop="1rem" paddingX="1rem">
        <PropertyInput
          value={name}
          onBlur={handleBlur}
          ref={firstFieldRef}
          onChange={handleNameChange}
        />
      </Box>
      <FormLabel fontSize="14px" paddingX="1rem" paddingBottom="1rem">
        Property type
      </FormLabel>
      <PropertyType onChange={handleTypeChange}>
        <PseudoBox
          paddingX="1rem"
          display="flex"
          paddingY="0.5rem"
          cursor="pointer"
          alignItems="center"
          justifyContent="space-between"
          _hover={{ bg: 'gray.100' }}
        >
          {activeType ? (
            <PseudoBox display="flex" fontWeight="normal" alignItems="center">
              <Icon size="0.75rem" name={activeType.icon} />
              <Text fontSize="0.875rem" marginLeft="0.4rem">
                {activeType.label}
              </Text>
            </PseudoBox>
          ) : (
            <Text fontSize="14px">Column</Text>
          )}
          <Icon size="0.5rem" name="caret-right" />
        </PseudoBox>
      </PropertyType>
    </Box>
  );
}
