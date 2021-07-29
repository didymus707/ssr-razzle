import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@chakra-ui/core';

export const NumberFieldComponent = (props: any) => {
  const [dummyValue, setDummyValue] = useState<string>('');
  const [pristine, setPristine] = useState<boolean>(true);
  const inputRef = useRef(null);

  const { column, placeholder } = props;

  const regexp = /^[0-9\b]+$/;

  const handleDummyValueChanged = (event: any) => {
    const updated_value = event.target.value;
    if (updated_value === '' || regexp.test(updated_value)) setDummyValue(updated_value);
    setPristine(false);
  };

  const handleOnEnterPressed = (event: any) => {
    event.stopPropagation();
    if (event.key !== 'Enter') return;
    if (pristine) return;
    props.updateCellValue(dummyValue, column.uid);
    event.target.blur();
    setPristine(true);
  };

  const handleOnBlur = () => {
    if (pristine) return;
    props.updateCellValue(dummyValue, column.uid);
    setPristine(true);
  };

  useEffect(() => {
    setDummyValue(props.value || '');
  }, [props.value]);

  const { field_props = {} } = props;

  return (
    <Input
      ref={inputRef}
      value={dummyValue}
      onBlur={handleOnBlur}
      onChange={handleDummyValueChanged}
      onKeyPress={handleOnEnterPressed}
      placeholder={placeholder}
      {...field_props}
    />
  );
};
