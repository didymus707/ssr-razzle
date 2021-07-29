// @ts-nocheck
import React, { useState } from 'react';
import { PopoverWrapper } from '../../../list-view.styles';
import { Box, Icon, Popover, PopoverTrigger, PopoverContent, Input } from '@chakra-ui/core';
import { PopoverListItem } from '../../popover-list-item';
import { available_properties } from '../../../list.data';

export const PropertySelect = (props: any) => {
  const [searchValue, setSearchValue] = useState('');

  const column = props.column;

  const handleSearchValueChange = (event: any) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  const filtered_properties = Object.values(available_properties).filter(
    (i: any) => i.label.toLowerCase().includes(searchValue.toLowerCase()) && !i.system,
  );

  return (
    <Popover isOpen={props.disabled ? false : undefined} trigger="hover" placement="right-start">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box className="list-item" cursor={props.disabled && 'not-allowed !important'}>
              <Icon className="icon" name={available_properties[column?.type]?.icon} />
              {available_properties[column?.type]?.label}
              <Box
                width="-webkit-fill-available"
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Icon name="chevron-right" size="12.5px" />
              </Box>
            </Box>
          </PopoverTrigger>

          <PopoverContent
            zIndex={4}
            width="max-content"
            boxShadow="none"
            _focus={{
              boxShadow: 'none',
              outline: 'none',
            }}
          >
            <PopoverWrapper>
              <Box className="input-item">
                <Input
                  value={searchValue}
                  onChange={handleSearchValueChange}
                  placeholder="Search property types"
                  variant="filled"
                  height={30}
                  fontSize={13}
                />
              </Box>
              {filtered_properties.map((i: any) => (
                <PopoverListItem
                  {...i}
                  active={i.key === column?.type}
                  onClick={() => {
                    props.onChange(i.key);
                    onClose();
                  }}
                  tooltip
                />
              ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
