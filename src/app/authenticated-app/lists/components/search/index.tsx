import React, { useEffect, useState, useCallback } from 'react';
import { Input, InputProps } from '@chakra-ui/core';
import _ from 'lodash';

type Props = InputProps & {
  focusWidth?: string;
  search_query: string;
  updateSearchQuery: Function;
};

export const ListSearch = (props: Props) => {
  const [value, setValue] = useState('');

  const { search_query, updateSearchQuery, focusWidth = '300px', ...rest } = props;

  const handleChange = (e: any) => {
    const _value = e.target.value;
    setValue(_value);
    debouncedCall(_value);
  };

  const updateSearchValue = (_value: string) => updateSearchQuery(_value);

  const debouncedCall = useCallback(_.debounce(updateSearchValue, 1000), []);

  useEffect(() => {
    setValue(search_query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Input
      // boxShadow="none"
      placeholder="Search"
      variant="filled"
      height="30px"
      fontSize="13px"
      style={{
        width: value.length > 0 ? 150 : 100,
      }}
      type="search"
      transition="all 0.2s ease"
      paddingX="10px"
      paddingY="2px"
      value={value}
      onChange={handleChange}
      _focus={{
        width: `${focusWidth} !important`,
      }}
      _active={{
        width: focusWidth,
      }}
      {...rest}
    />
  );
};
