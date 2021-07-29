// @ts-nocheck
import React from 'react';
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { PopoverWrapper } from '../../../list-view.styles';
import { available_time_formats } from '../../../list.data';
import { parseDate } from '../../../lists.utils';

const TimeFormatOption = (props: any) => {
  const { label, format, date_today } = props;
  return (
    <Box className={`list-item ${props.active ? 'active' : ''}`} onClick={props.onClick}>
      {`${label} (${date_today.format(format)})`}
    </Box>
  );
};

export const TimeFormatSelect = (props: any) => {
  let customization = props?.column?.customization || {};
  let time_format = customization?.time_format || 'h:mm A';

  let selected_format_option = available_time_formats.find((i: any) => i.format === time_format);

  const date_today = parseDate(new Date().toString());

  const handleFormatSelect = (format: string) => {
    props.updateCustomization(props.column.uid, {
      ...customization,
      time_format: format,
    });
  };

  return (
    <Popover trigger="hover" placement="right-start">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <div className="list-item-no-icon">
              {`${selected_format_option?.label} (${date_today.format(
                selected_format_option?.format,
              )})`}
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <Icon name="chevron-right" size="12.5px" />
              </Box>
            </div>
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
              {available_time_formats.map((i: any, index) => (
                <TimeFormatOption
                  {...i}
                  key={index}
                  date_today={date_today}
                  active={i.format === selected_format_option?.format}
                  onClick={() => {
                    handleFormatSelect(i.format);
                    onClose();
                    props.close();
                  }}
                />
              ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
