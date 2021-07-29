import React from 'react';
import { Box, IconButton, useDisclosure } from '@chakra-ui/core';
import { DateFieldComponent } from '../../../../../lists/components/cell-properties';
import { Icon } from '@chakra-ui/core/dist';
import { Button } from 'app/components';

interface Props {
  from: string | null;
  to: string | null;
  onChange: Function;
}

export const PaymentRequestDateRangePicker = (props: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { from, to, onChange } = props;

  const inputProps = {
    size: 'sm',
    width: 100,
    variant: 'filled',
    borderRadius: '5px',
  };

  return (
    <Box display="flex" alignItems="center">
      {isOpen ? (
        <>
          <IconButton
            variant="ghost"
            variantColor="blue"
            aria-label="Send email"
            icon="small-close"
            size="xs"
            borderRadius="12px"
            mr="5px"
            textDecoration="none !important"
            onClick={() => {
              onChange({ from: null, to: null });
              onClose();
            }}
          />
          <DateFieldComponent
            value={from}
            inputProps={{ ...inputProps, mr: '5px' }}
            updateCellValue={(updated_from: any) => {
              onChange({ from: updated_from.split('T')[0] + 'T00:00:00.000Z' });
            }}
          />
          <Icon name="chevron-right" size="14px" />
          <DateFieldComponent
            value={to}
            inputProps={{ ...inputProps, ml: '5px' }}
            updateCellValue={(updated_to: any) =>
              onChange({ to: updated_to.split('T')[0] + 'T12:59:59.000Z' })
            }
          />
        </>
      ) : (
        <Button
          size="xs"
          onClick={onOpen}
          variant="ghost"
          color="#4f4f4f"
          // @ts-ignore
          leftIcon="filter"
        >
          Date filter
        </Button>
      )}
    </Box>
  );
};
