import React from 'react';
import { DateFormatSelect } from './date-fomat-select';
import { Box, Switch } from '@chakra-ui/core/dist';
import { TimeFormatSelect } from './time-format-select';

export const DateCustomizationMenu = (props: any) => {
  const column = props.column;
  const customization = column?.customization || {};

  const handleTimeSwitchChanged = (event: any) => {
    props.updateCustomization(column.uid, {
      ...customization,
      include_time: event.target.checked,
    });
  };

  return (
    <>
      <Box className="property-type-label" marginTop="10px">
        DATE FORMAT
      </Box>
      <DateFormatSelect {...props} />
      <Box
        display="flex"
        alignItems="center"
        fontSize="13px"
        marginTop="10px"
        lineHeight="16px"
        marginBottom="10px"
      >
        <Switch
          size="sm"
          paddingLeft="10px"
          marginRight="10px"
          marginTop="3px"
          boxShadow="none"
          onChange={handleTimeSwitchChanged}
          isChecked={!!customization?.include_time}
        />
        Include a time field
      </Box>
      {!!customization?.include_time && (
        <>
          <Box className="property-type-label" marginTop="10px">
            TIME FORMAT
          </Box>
          <TimeFormatSelect {...props} />
        </>
      )}
    </>
  );
};
