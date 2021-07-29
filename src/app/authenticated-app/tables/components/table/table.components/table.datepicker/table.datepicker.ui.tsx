import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  InputProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/core';
import { getMonth, getYear } from 'date-fns';
import format from 'date-fns/format';
import * as React from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { TableDatePickerStyles } from './table.datepicker.styles';
import { debounce } from 'lodash';

type TableDatePickerProps = {
  value: string;
  date_format?: string;
  defaultIsOpen?: boolean;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
} & Omit<InputProps, 'onChange' | 'onBlur'>;

const parseDate = (str: string) => {
  const parsed = new Date(str);
  if (DateUtils.isDate(parsed)) {
    return parsed;
  } else {
    if (str.split('-').length === 3) {
      const [day, month, year] = str.split('-');
      const dayInNumber = parseInt(day, 10);
      const monthInNumber = parseInt(month, 10);
      const yearInNumber = parseInt(year, 10);

      return new Date(yearInNumber, monthInNumber - 1, dayInNumber);
    }
    return new Date();
  }
};

export const TableDatePicker = React.forwardRef(
  (props: TableDatePickerProps, ref: React.Ref<HTMLInputElement>) => {
    const { defaultIsOpen, onBlur, onChange, value: initialValue, date_format = 'dd-MM-yyyy', ...rest } = props;

    const initialFocusRef = React.useRef<any>();

    React.useEffect(() => {
      if (
        initialValue &&
        parseDate(initialValue) &&
        parseDate(initialValue).toString() !== 'Invalid Date'
      ) {
        const date = parseDate(initialValue);
        setSelectedDays(date);
        setDummyValue(format(date, date_format));
        setInputValue(format(date, date_format));
      } else {
        setSelectedDays(new Date());
        setDummyValue('');
        setInputValue('');
      }
    }, [date_format, initialValue]);

    const [selectedDays, setSelectedDays] = React.useState<any>(
      initialValue && parseDate(initialValue) ? parseDate(initialValue) : new Date()
    );
    const [dummyValue, setDummyValue] = React.useState(
      initialValue && parseDate(initialValue).toString() !== 'Invalid Date'
        ? format(selectedDays, date_format)
        : ''
    );
    const [inputValue, setInputValue] = React.useState(
      selectedDays && parseDate(selectedDays).toString() !== 'Invalid Date'
        ? format(selectedDays, date_format)
        : ''
    );

    const handleDaysSelect = (day: Date) => {
      const formattedDate = format(day, date_format);
      setSelectedDays(day);
      setInputValue(formattedDate);
      setDummyValue(formattedDate);
      onChange && onChange(formattedDate);
    };

    const handleDaysClear = () => {
      const date = new Date();
      const formattedDate = format(date, date_format);

      setDummyValue('');
      setSelectedDays(date);
      setInputValue(formattedDate);

      onChange && onChange('');
    };

    const debouncedApiCall = React.useCallback(
      debounce((value: string) => {
        onChange && onChange(value);
      }, 1500),
      []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const selectedDate = parseDate(value);
      setInputValue(value);
      setDummyValue(value);

      if (selectedDate.toString().toLowerCase() !== 'invalid date') {
        const formattedDate = format(selectedDate, date_format);
        setSelectedDays(selectedDate);
        debouncedApiCall(formattedDate);
      }
    };

    return (
      <TableDatePickerStyles>
        <Popover initialFocusRef={initialFocusRef} defaultIsOpen={defaultIsOpen}>
          <PopoverTrigger>
            <Flex
              role="button"
              tabIndex={0}
              height="100%"
              cursor="pointer"
              paddingX="0.5rem"
              borderRadius="5px"
              alignItems="center"
              transition="all 0.2s"
              _focus={{
                boxShadow: 'none',
                borderColor: '#2034c5',
              }}
              {...rest}
            >
              {dummyValue}
            </Flex>
          </PopoverTrigger>
          <PopoverContent
            zIndex={99999}
            overflow="hidden"
            borderRadius="5px"
            position="absolute"
            boxShadow="10px 10px 40px rgba(0,0,0,0.2)"
          >
            <PopoverBody padding="0">
              <Box padding="0.5rem">
                <Input
                  ref={initialFocusRef}
                  size="sm"
                  value={inputValue}
                  onChange={handleInputChange}
                  {...rest}
                />
              </Box>
              <Box paddingBottom="0.5rem">
                <DayPicker
                  showOutsideDays
                  selectedDays={selectedDays}
                  onDayClick={handleDaysSelect}
                  month={new Date(getYear(selectedDays), getMonth(selectedDays))}
                />
              </Box>
              <Box>
                <Divider marginTop="0" marginBottom="0" />
                <Button
                  size="sm"
                  isFullWidth
                  borderRadius="0"
                  variant="unstyled"
                  _hover={{ bg: 'gray.50' }}
                  onClick={handleDaysClear}
                  paddingX="0.875rem!important"
                >
                  Clear
                </Button>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </TableDatePickerStyles>
    );
  }
);
