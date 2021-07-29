// @ts-nocheck
import React from 'react';
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { available_conjunctions } from '../../../list.data';
import { PopoverWrapper } from '../../../list-view.styles';

export const ConjunctionSelect = (props: any) => {
  const { selected_conjunction, allow_select } = props;
  const popover_props = {};

  if (!allow_select) {
    popover_props['isOpen'] = false;
  }

  return (
    <Popover {...popover_props}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box
              className="conjunction-select"
              cursor={!allow_select && 'not-allowed !important'}
              alignItems="center"
            >
              <Box className="selected-label-text">
                {available_conjunctions[selected_conjunction].label}
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
              {Object.values(available_conjunctions).map((conjunction: any) => (
                <Box
                  key={conjunction.key}
                  className={`list-item ${
                    conjunction.key === selected_conjunction ? 'active' : ''
                  }`}
                  style={{
                    fontSize: 14,
                  }}
                  onClick={() => {
                    props.onChange(conjunction.key);
                    onClose();
                  }}
                >
                  {conjunction.label}
                </Box>
              ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
