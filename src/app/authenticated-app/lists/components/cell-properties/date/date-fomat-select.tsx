// @ts-nocheck
import React from 'react';
import { Box, Icon, Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/core';
import { parseDate } from '../../../lists.utils';
import { available_date_formats, calendarOutputFormat } from '../../../list.data';
import { PopoverWrapper } from '../../../list-view.styles';

const DateFormatOption = (props: any) => {
  const { label, format, date_today } = props;
  return (
    <Box className={`list-item ${props.active ? 'active' : ''}`} onClick={props.onClick}>
      {`${label} (${
        format !== 'relative'
          ? date_today.format(format)
          : date_today.calendar(null, calendarOutputFormat)
      })`}
    </Box>
  );
};

export const DateFormatSelect = (props: any) => {
  let customization = props?.column?.customization || {};

  let date_format = customization?.date_format || 'D/MM/YYYY';

  let selected_format_option = available_date_formats.find((i: any) => i.format === date_format);

  const date_today = parseDate(new Date().toString());

  const handleFormatSelect = (format: string) => {
    props.updateCustomization(props.column.uid, {
      ...customization,
      date_format: format,
    });
  };

  return (
    <Popover trigger="hover" placement="right-start">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <div className="list-item-no-icon">
              {`${selected_format_option.label} (${
                selected_format_option.format !== 'relative'
                  ? date_today.format(selected_format_option.format)
                  : date_today.calendar(null, calendarOutputFormat)
              })`}
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
              {available_date_formats.map((i: any, index) => (
                <DateFormatOption
                  {...i}
                  key={index}
                  date_today={date_today}
                  active={i.format === selected_format_option.format}
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
