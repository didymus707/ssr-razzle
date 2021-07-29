import React from 'react';
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { available_operators } from '../../../list.data';
import { PopoverWrapper } from '../../../list-view.styles';

export const SubOperatorSelect = (props: any) => {
  const { operator, subOperator } = props;
  // @ts-ignore
  const sub_operators = available_operators[operator].subOperators;

  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box className="operator-select" alignItems="center" width="100px !important">
              <Box className="selected-label-text">{subOperator}</Box>
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
              {sub_operators.map((_subOperator: string, index: number) => (
                <Box
                  key={index}
                  className={`list-item ${_subOperator === subOperator ? 'active' : ''}`}
                  style={{
                    fontSize: 14,
                  }}
                  onClick={() => {
                    props.onChange(_subOperator);
                    // @ts-ignore
                    onClose();
                  }}
                >
                  {_subOperator}
                </Box>
              ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
