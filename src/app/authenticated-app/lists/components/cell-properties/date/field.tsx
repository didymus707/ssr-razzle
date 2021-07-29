import React, { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  useDisclosure,
} from '@chakra-ui/core';
import { Input } from 'app/components';
import { parseDate } from '../../../lists.utils';
import { calendarOutputFormat } from '../../../list.data';
import { DateCellEditor } from './editor';
import { PopoverWrapper } from '../../../list-view.styles';

export const DateFieldComponent = (props: any) => {
  const [rawValue, setRawValue] = useState(props.value);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { column = {}, placeholder, inputProps = {}, isDisabled = false } = props;

  const date_format = column?.customization?.date_format || 'D/MM/YYYY';
  const time_format = column?.customization?.time_format || 'h:mm A';
  const include_time = column?.customization?.include_time || false;

  const value = parseDate(rawValue);

  let formatted_date =
    date_format !== 'relative'
      ? value.format(date_format)
      : value.calendar(null, calendarOutputFormat);

  if (include_time) {
    if (date_format === 'relative') formatted_date += ' at';
    formatted_date += ` ${value.format(time_format)}`;
  }

  const handleUpdate = (_value: any) => {
    setRawValue(_value);
    props.updateCellValue(_value, column.uid);
    onClose();
  };

  return (
    <Popover
      closeOnEsc
      isOpen={!isDisabled ? isOpen : false}
      onClose={onClose}
      placement="bottom-start"
    >
      <PopoverTrigger>
        <div onClick={onOpen}>
          <Input
            isDisabled
            cursor={!isDisabled ? 'cursor' : 'not-allowed'}
            placeholder={placeholder}
            value={rawValue && value.isValid() ? formatted_date : ''}
            _disabled={{
              color: '#333333',
            }}
            {...inputProps}
          />
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
          <DateCellEditor
            value={rawValue}
            updateValue={handleUpdate}
            customization={column?.customization}
            close={onClose}
          />
        </PopoverWrapper>
      </PopoverContent>
    </Popover>
  );
};
