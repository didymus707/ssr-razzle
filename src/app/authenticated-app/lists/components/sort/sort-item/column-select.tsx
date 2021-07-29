// @ts-nocheck
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { PopoverWrapper } from '../../../list-view.styles';
import { available_properties } from '../../../list.data';
import React from 'react';

export const ColumnSelect = (props: any) => {
  const { columns, columns_by_id, sorted_columns } = props;

  const selected_column = columns[props.selected_column];

  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box className="column-select" alignItems="center">
              <Box display="flex" alignItems="center">
                <Icon className="icon" name={available_properties[selected_column.type].icon} />
                <Box className="selected-label-text">{selected_column?.label}</Box>
              </Box>
              <Icon name="chevron-down" />
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
            overflowY="scroll"
            maxH="320px"
          >
            <PopoverWrapper>
              {columns_by_id
                .filter((i: string) => !sorted_columns.includes(i))
                .map((i: string) => (
                  <Box
                    key={i}
                    className={`list-item ${selected_column.uid === i ? 'active' : ''}`}
                    width="100%"
                    style={{
                      fontSize: 14,
                    }}
                    onClick={() => {
                      props.onChange(i);
                      onClose();
                    }}
                  >
                    <Icon
                      className="icon"
                      name={available_properties[columns[i].type].icon}
                      size="14px"
                    />
                    {columns[i].label}
                  </Box>
                ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
