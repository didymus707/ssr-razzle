import React, { useCallback, useEffect, useState } from 'react';
import { Input, Box } from '@chakra-ui/core';
import _ from 'lodash';
import { getFilterFieldRenderer } from '../../../lists.utils';

export const ValueInput = (props: any) => {
  const [tempValue, setTempValue] = useState<string>('');

  const { debounceUpdate = true } = props;

  const handleChange = (e: any) => {
    const _value = e.target.value;
    setTempValue(_value);
    if (debounceUpdate) {
      debouncedCall(_value);
    } else {
      updateFilterValue(_value);
    }
  };

  const updateFilterValue = (_value: string) => props.onChange(_value);

  const debouncedCall = useCallback(_.debounce(updateFilterValue, 1000), []);

  useEffect(() => {
    setTempValue(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let FieldComponent = getFilterFieldRenderer(props.column.type);

  if (props.column.type === 'DATE') {
    if (props.subOperator === 'number of days from now') {
      return (
        <Input
          className="value-input"
          autoFocus
          value={tempValue || ''}
          type="number"
          onChange={handleChange}
          min={0}
        />
      );
    }

    if (props.subOperator !== 'exact date') {
      return <Input isDisabled className="value-input" />;
    }

    return (
      <FieldComponent
        column={props.column}
        updateCellValue={(_value: any) => props.onChange(_value)}
        inputProps={{
          className: 'value-input',
          fontSize: 12,
        }}
        value={props.value}
      />
    );
  }

  if (props.column.type === 'MULTI SELECT') {
    return (
      <Box>
        <FieldComponent
          column={props.column}
          updateCellValue={(_value: any) => props.onChange(_value)}
          allowCreate={false}
          inputProps={{
            className: 'value-input',
            minHeight: '30px',
          }}
          optionItemStyles={{
            fontSize: 12,
          }}
          value={props.value}
        />
      </Box>
    );
  }

  if (props.column.type === 'SELECT') {
    return (
      <Box>
        <FieldComponent
          column={props.column}
          updateCellValue={(_value: any) => props.onChange(_value)}
          allowCreate={false}
          inputProps={{
            className: 'value-input',
            minHeight: '30px',
          }}
          optionItemStyles={{
            fontSize: 12,
          }}
          value={props.value}
        />
      </Box>
    );
  }

  if (props.column.type === 'DND') {
    return (
      <Box>
        <FieldComponent
          column={props.column}
          updateCellValue={(_value: any) => props.onChange(_value)}
          inputProps={{
            className: 'value-input',
            minHeight: '30px',
          }}
          optionItemStyles={{
            fontSize: 12,
          }}
          value={props.value}
        />
      </Box>
    );
  }

  return (
    <Input
      isDisabled={['empty', 'notEmpty'].includes(props.selected_operator)}
      className="value-input"
      autoFocus
      value={!['empty', 'notEmpty'].includes(props.selected_operator) ? tempValue : ''}
      onChange={handleChange}
    />
  );
};
