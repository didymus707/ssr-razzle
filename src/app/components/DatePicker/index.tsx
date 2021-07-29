import { Icon, PseudoBox } from '@chakra-ui/core';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import React from 'react';
import { DateUtils, DayPickerInputProps } from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { OptionTypeBase } from 'react-select';
import './styles.css';

type DatePickerComponentProps = DayPickerInputProps & {
  size?: string;
  showIcon?: boolean;
  isInvalid?: boolean;
};

const sizes = { sm: '2rem', md: '2.5rem', lg: '3rem' } as OptionTypeBase;

function parseDate(str: string, format: any, locale: any) {
  const parsed = dateFnsParse(str, format, new Date(), { locale });
  if (DateUtils.isDate(parsed)) {
    return parsed;
  }
  return undefined;
}

function formatDate(date: any, format: any, locale: any) {
  const dateString = dateFnsFormat(date, format, { locale });
  const split = dateString.split(' ');
  if (split.length === 3 && split[2].startsWith('0')) {
    return dateString.replace('0', '');
  } else {
    return dateString;
  }
}

export function DatePickerComponent({
  value,
  onDayChange,
  size = 'md',
  showIcon = true,
  isInvalid,
  ...rest
}: DatePickerComponentProps) {
  const FORMAT = 'dd MMMM yyyy';

  const containerRef = React.useRef<HTMLDivElement>(null);

  function handleFocus() {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }

  return (
    <PseudoBox
      display="flex"
      padding="0 1rem"
      borderRadius="8px"
      ref={containerRef}
      alignItems="center"
      height={sizes[size]}
      justifyContent="space-between"
      border={`1px solid ${isInvalid ? '#e53e3e' : '#858C94'}`}
      _hover={{
        border: `1px solid ${isInvalid ? '#e53e3e' : '#DADEE3'}`,
      }}
      _focus={{
        boxShadow: `0 0 0 1px ${isInvalid ? '#e53e3e' : '#3525E6'}`,
        border: `1px solid ${isInvalid ? '#e53e3e' : '#3525E6'}`,
      }}
      _active={{
        border: `1px solid ${isInvalid ? '#e53e3e' : '#3525E6'}`,
        boxShadow: `0 0 0 1px ${isInvalid ? '#e53e3e' : '#3525E6'}`,
      }}
      boxShadow={isInvalid ? '0 0 0 1px #e53e3e' : 'none'}
      fontSize="0.875rem"
    >
      <DayPickerInput
        inputProps={{
          style: {
            width: '100%',
            outline: 'none',
            fontSize: 'inherit',
            background: 'transparent',
          },
          onFocus: handleFocus,
        }}
        value={value}
        format={FORMAT}
        parseDate={parseDate}
        formatDate={formatDate}
        onDayChange={onDayChange}
        placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
        {...rest}
      />
      {showIcon && <Icon name="calendar" size="14px" color="gray.500" />}
    </PseudoBox>
  );
}
