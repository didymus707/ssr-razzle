// @ts-nocheck
import React from 'react';
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { available_operators } from '../../../list.data';
import { PopoverWrapper } from '../../../list-view.styles';

export const OperatorSelect = (props: any) => {
  const { selected_operator, column } = props;
  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box
              className="operator-select"
              alignItems="center"
              width={column.type === 'DATE' && '100px !important'}
              mr={column.type === 'DATE' && '5px'}
            >
              <Box className="selected-label-text">
                {column.type === 'NUMBER' && selected_operator === 'equals'
                  ? 'equals (=)'
                  : column.type === 'NUMBER' && selected_operator === 'notEqual'
                  ? 'not equals to (≠)'
                  : available_operators[selected_operator].label}
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
          >
            <PopoverWrapper>
              {Object.values(available_operators)
                .filter((operator: any) => operator.column_types.includes(column.type))
                .map((operator: any) => (
                  <Box
                    key={operator.key}
                    className={`list-item ${operator.key === selected_operator ? 'active' : ''}`}
                    style={{
                      fontSize: 14,
                    }}
                    onClick={() => {
                      props.onChange(operator.key);
                      onClose();
                    }}
                  >
                    {column.type === 'NUMBER' && operator.key === 'equals'
                      ? 'equals (=)'
                      : column.type === 'NUMBER' && operator.key === 'notEqual'
                      ? 'not equals to (≠)'
                      : operator.label}
                  </Box>
                ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
