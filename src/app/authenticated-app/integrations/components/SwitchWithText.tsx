import React from 'react';
import { Flex, Text, Switch, FlexProps } from '@chakra-ui/core';

export function SwitchWithText({ left, right, isRight, setIsRight, ...rest }: FlexProps & {
  left: string;
  right: string;
  isRight: boolean;
  setIsRight: (v: boolean) => void;
}) {
  return (
    <Flex
      alignItems="center"
      marginBottom=".625rem"
      marginTop="3.375rem"
      justifyContent="flex-end"
      {...rest}
    >
      <Text
        color={!isRight ? '#3d50df' : 'rgba(0, 0, 0, 0.3)'}
        fontWeight={!isRight ? 600 : 'normal'}
        marginRight=".625rem"
        cursor="pointer"
        onClick={() => setIsRight(false)}
      >
        {left}
      </Text>

      <Switch
        size="sm"
        isChecked={isRight}
        value={isRight}
        color="blue"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsRight(event.target.checked)}
      />

      <Text
        color={isRight ? '#3d50df' : 'rgba(0, 0, 0, 0.3)'}
        fontWeight={isRight ? 600 : 'normal'}
        marginLeft=".625rem"
        cursor="pointer"
        onClick={() => setIsRight(true)}
      >
        {right}
      </Text>
    </Flex>
  )
}
