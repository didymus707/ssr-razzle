import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@chakra-ui/core';

export const EmailFieldComponent = (props: any) => {
  const [dummyValue, setDummyValue] = useState<string>('');
  const [pristine, setPristine] = useState<boolean>(true);
  const inputRef = useRef(null);

  const { column, placeholder } = props;

  const handleDummyValueChanged = (event: any) => {
    const updated_value = event.target.value;
    setDummyValue(updated_value);
    setPristine(false);
  };

  const handleOnEnterPressed = (event: any) => {
    event.stopPropagation();
    if (event.key !== 'Enter') return;
    if (pristine) return;
    if (dummyValue === props.value) return;
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

  return (
    <Input
      ref={inputRef}
      value={dummyValue}
      onBlur={handleOnBlur}
      onChange={handleDummyValueChanged}
      onKeyPress={handleOnEnterPressed}
      textDecor={dummyValue ? 'underline' : 'none'}
      color="#344ceb"
      placeholder={placeholder}
    />
  );
};
