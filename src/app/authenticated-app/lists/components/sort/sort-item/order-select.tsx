// @ts-nocheck
import React from 'react';
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { available_sort_orders } from '../../../list.data';
import { PopoverWrapper } from '../../../list-view.styles';

export const OrderSelect = (props: any) => {
  const { selected_order, columnType } = props;

  if (['TEXT', 'EMAIL', 'URL'].includes(columnType))
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box mr="12.5px" fontSize="14px !important" color="#757575 !important">
          from
        </Box>
        <Box className="sort-slider">
          <Box
            className={`item ${selected_order === 'ASC' && 'active'} `}
            onClick={() => {
              if (selected_order !== 'ASC') props.onChange('ASC');
            }}
          >
            A-Z
          </Box>
          <Box
            className={`item ${selected_order === 'DESC' && 'active'}`}
            onClick={() => {
              if (selected_order !== 'DESC') props.onChange('DESC');
            }}
          >
            Z-A
          </Box>
        </Box>
      </Box>
    );

  if (['NUMBER', 'PHONE NUMBER', 'DATE'].includes(columnType))
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box mr="12.5px" fontSize="14px !important" color="#757575 !important">
          from
        </Box>
        <Box className="sort-slider">
          <Box
            className={`item ${selected_order === 'ASC' && 'active'} `}
            onClick={() => {
              if (selected_order !== 'ASC') props.onChange('ASC');
            }}
          >
            1-9
          </Box>
          <Box
            className={`item ${selected_order === 'DESC' && 'active'}`}
            onClick={() => {
              if (selected_order !== 'DESC') props.onChange('DESC');
            }}
          >
            9-1
          </Box>
        </Box>
      </Box>
    );

  return (
    <Popover>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <Box className="sort-order-select">
              <Box className="selected-label-text">
                {available_sort_orders[selected_order].label}
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
              {Object.values(available_sort_orders).map((sort_order: any) => (
                <Box
                  key={sort_order.key}
                  className={`list-item ${sort_order.key === selected_order ? 'active' : ''}`}
                  style={{
                    fontSize: 14,
                  }}
                  onClick={() => {
                    props.onChange(sort_order.key);
                    onClose();
                  }}
                >
                  {sort_order.label}
                </Box>
              ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
