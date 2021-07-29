import React, { ChangeEvent, useRef } from 'react';
import { Button } from '../Button';

interface Props {
  name: string;
  onChange: Function;
  accept?: string;
}

export const FileSelectButton = (props: Props) => {
  const inputRef = useRef(null);

  const { name, onChange, ...rest } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event);
  };

  return (
    <div>
      <input
        ref={inputRef}
        name={name}
        type="file"
        style={{ display: 'none' }}
        onChange={handleChange}
        accept={props.accept}
      />
      <Button
        {...rest}
        size="sm"
        variant="link"
        color="#333333"
        leftIcon="arrow-up"
        onClick={() => {
          // @ts-ignore
          inputRef.current.click();
        }}
      >
        Select File
      </Button>
    </div>
  );
};
