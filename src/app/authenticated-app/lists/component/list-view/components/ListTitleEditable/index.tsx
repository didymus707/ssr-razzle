import React, { useEffect, useRef, useState } from 'react';
import { Input } from 'app/components';

interface Props {
  isInitial: boolean;
  isEditing: boolean;
  value: string;
  onChange: Function;
}

export const ListTitleEditable = (props: Props) => {
  const [tempValue, setTempValue] = useState<string>('');
  const inputRef = useRef();

  const handleOnEnterPressed = (event: any) => {
    if (event.key !== 'Enter') return;
    props.onChange(tempValue);
    event.target.blur();
  };

  const handleOnBlur = () => {
    props.onChange(tempValue);
  };

  useEffect(() => {
    setTempValue(props.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setTempValue(value);
  };

  useEffect(() => {
    if (tempValue === 'Untitled' && inputRef?.current) {
      // @ts-ignore
      inputRef.current?.focus();
    }
  }, [tempValue]);

  return (
    <Input
      isDisabled={props.isInitial}
      value={tempValue}
      size="md"
      // @ts-ignore
      ref={inputRef}
      className="list-title-input"
      onChange={handleInputChange}
      onBlur={handleOnBlur}
      onKeyPress={handleOnEnterPressed}
      fontWeight="500"
      isInvalid={tempValue === ''}
      width={Math.max(200, tempValue?.length * 11)}
      maxWidth="45vw"
      marginRight="25px"
      borderWidth="4px"
      _disabled={{
        color: '#4f4f4f',
        cursor: 'not-allowed',
      }}
      // border="none"
      // color="#333333"
      // variant="flushed"
      // _focus={{
      //   border: 'inherit',
      // }}
    />
  );
};
