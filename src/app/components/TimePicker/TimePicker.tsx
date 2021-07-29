import React from 'react';
import { Flex, Select, IconButton, SelectProps } from '@chakra-ui/core';
import { hourArray, minArray } from './data';

function TimeSelect({ value, onChange, placeholder, children, ...rest }: SelectProps) {
  return (
    <Select
      size="sm"
      value={value}
      onChange={onChange}
      fontSize="0.875rem"
      marginRight="0.625rem"
      placeholder={placeholder}
      {...rest}
    >
      {children}
    </Select>
  );
}

export type TimePickerValue = {
  hour?: string;
  minutes?: string;
};

type TimePickerProps = {
  value?: string;
  onDelete?: () => void;
  onChange?: (value: TimePickerValue) => void;
};

export function TimePicker({ onChange, onDelete, value }: TimePickerProps) {
  const hour = value && value.split(':')[0];
  const minutes = value && value.split(':')[1];
  const [selectTime, setSelectTime] = React.useState({
    hour: hour || '',
    minutes: minutes || '',
  });

  function handleTimeChange({ key, event }: any) {
    const newTime = { ...selectTime, [key]: event.target.value };
    setSelectTime(newTime);
    if (onChange) {
      onChange(newTime);
    }
  }
  return (
    <Flex alignContent="center">
      <TimeSelect
        width="150px"
        placeholder="hh"
        value={selectTime.hour}
        onChange={(event: any) => handleTimeChange({ key: 'hour', event })}
      >
        {hourArray.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </TimeSelect>
      <TimeSelect
        width="150px"
        placeholder="mm"
        value={selectTime.minutes}
        onChange={(event: any) => handleTimeChange({ key: 'minutes', event })}
      >
        {minArray.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </TimeSelect>
      <IconButton
        icon="delete"
        fontSize="14px"
        alignSelf="end"
        color="gray.500"
        onClick={onDelete}
        paddingLeft="0rem"
        paddingRight="0rem"
        aria-label="remove"
        background="transparent"
        _hover={{ background: 'none', outline: 'none' }}
      />
    </Flex>
  );
}
