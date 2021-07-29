import {
  Flex,
  Icon,
  Input,
  InputGroup,
  FormControl,
  InputLeftElement,
} from '@chakra-ui/core';
import React from 'react';
import { useSearch } from '../../../../../../hooks';

export function PropertySearchForm({
  onChange,
  initialInputState,
}: {
  initialInputState?: string;
  onChange?: (value: string) => void;
}) {
  const search = useSearch({ initialValue: initialInputState, onChange });

  return (
    <FormControl marginBottom="1rem" marginTop="1rem">
      <Flex>
        <InputGroup size="sm" width="100%">
          <InputLeftElement children={<Icon name="search" fill="#2e384d" />} />
          <Input
            type="text"
            color="#212242"
            placeholder="Search"
            value={search.input}
            onChange={search.handleChange}
          />
        </InputGroup>
      </Flex>
    </FormControl>
  );
}
