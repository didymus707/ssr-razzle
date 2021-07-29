import React, { useEffect, useState } from 'react';
import { Input } from '@chakra-ui/core';

export const EmailFieldComponent = (props: any) => {
  const [dummyValue, setDummyValue] = useState('');

  const handleDummyValueChanged = (event: any) => {
    const updated_value = event.target.value;
    setDummyValue(updated_value);
  };

  useEffect(() => {
    setDummyValue(props.value || '');
  }, [props.value]);

  return (
    <div>
      <Input value={dummyValue} onChange={handleDummyValueChanged} textDecor="underline" />
    </div>
  );
};
