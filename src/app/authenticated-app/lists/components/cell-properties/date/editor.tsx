import React, { useEffect, useState } from 'react';
import { Box, Input } from '@chakra-ui/core/dist';
import DayPicker from 'react-day-picker';
import { parseDate, parseTime } from '../../../lists.utils';

export const DateCellEditor = (props: any) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [dummyValue, setDummyValue] = useState('');
  const [dummyTimeValue, setDummyTimeValue] = useState('');
  const [value, setValue] = useState('');

  const { customization } = props;

  const parsedValue = parseDate(value);

  const handleChange = (val: any) => {
    if (!val) return props.updateValue(null);
    const parsed_date = parseDate(val);
    const parsed_time = parseTime(dummyTimeValue);
    parsed_date.set('hour', parsed_time.get('hour'));
    parsed_date.set('minute', parsed_time.get('minute'));
    parsed_date.set('second', parsed_time.get('second'));
    setDummyValue(parsed_date.format('D MMMM YYYY'));
    setValue(parsed_date.toISOString());
    props.updateValue(parsed_date.toISOString());
    props.close();
  };

  const handleClear = () => {
    handleChange('');
    props.close();
  };

  const handleDummyValueChanged = (e: any) => {
    const val = e.target.value;
    setDummyValue(val);
  };

  const handleDummyTimeValueChanged = (e: any) => {
    const val = e.target.value;
    setDummyTimeValue(val);
  };

  const handleEnterPressed = (e: any) => {
    if (e.key !== 'Enter') return;
    const parsed_time = parseTime(dummyTimeValue);
    const parsed_date = parseDate(dummyValue);
    parsed_date.set('hour', parsed_time.get('hour'));
    parsed_date.set('minute', parsed_time.get('minute'));
    parsed_date.set('second', parsed_time.get('second'));
    setDummyValue(parsed_date.format('D MMMM YYYY'));
    setDummyTimeValue(parsed_time.format('hh:mm A'));
    setValue(parsed_date.toISOString());
    props.updateValue(parsed_date.toISOString());
    props.close();
  };

  const handleEditorInit = () => {
    setValue(props.value);
    if (!props.value) {
      setDummyValue(parseDate(new Date().toString()).format('D MMMM YYYY'));
      setDummyTimeValue(parseDate(new Date().toString()).format('hh:mm A'));
      return;
    }
    const parsed_date = parseDate(props.value);
    if (!parsed_date.isValid()) {
      setDummyValue(parseDate(new Date().toString()).format('D MMMM YYYY'));
      setDummyTimeValue(parseDate(new Date().toString()).format('hh:mm A'));
      return;
    }
    setDummyValue(parsed_date.format('D MMMM YYYY'));
    setDummyTimeValue(parsed_date.format('hh:mm A'));
    setValue(parsed_date.toISOString());
    setInitialized(true);
  };

  useEffect(() => {
    handleEditorInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="date-editor" fontSize="13px !important">
      <Box className="input-item" display="flex" alignItems="center" justifyContent="space-between">
        <Input
          value={dummyValue}
          isInvalid={!parseDate(dummyValue).isValid() && initialized}
          variant="filled"
          height={30}
          fontSize={13}
          autoFocus
          onChange={handleDummyValueChanged}
          onKeyPress={handleEnterPressed}
          errorBorderColor="red.200"
          width={customization?.include_time ? '135px' : '100%'}
          _disabled={{
            color: 'black',
          }}
          _focus={{
            outline: 'none',
          }}
        />
        {customization?.include_time && (
          <Input
            variant="filled"
            height={30}
            fontSize={13}
            value={dummyTimeValue}
            onChange={handleDummyTimeValueChanged}
            onKeyPress={handleEnterPressed}
            isInvalid={!parseTime(dummyTimeValue).isValid() && initialized}
            width="95px"
            errorBorderColor="red.200"
            _disabled={{
              color: 'black',
            }}
            _focus={{
              outline: 'none',
            }}
          />
        )}
      </Box>
      <DayPicker
        modifiers={{
          selectedDay: parsedValue.toDate(),
        }}
        modifiersStyles={{
          selectedDay: {
            backgroundColor: '#3D43DF',
            borderRadius: 5,
          },
        }}
        showOutsideDays
        month={value && parsedValue.isValid() ? parsedValue.toDate() : new Date()}
        onDayClick={handleChange}
        selectedDays={parsedValue.toDate()}
      />
      <hr />
      <Box
        className="list-item"
        style={{
          paddingLeft: 20,
        }}
        onClick={handleClear}
      >
        Clear
      </Box>
    </Box>
  );
};
