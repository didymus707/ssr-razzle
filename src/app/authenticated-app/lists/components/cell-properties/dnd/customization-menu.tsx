import React from 'react';
import {
  Box,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  PseudoBox,
} from '@chakra-ui/core/dist';
import { available_properties } from '../../../list.data';
import { PopoverWrapper } from '../../../list-view.styles';

export const ColumnSelect = (props: any) => {
  const { columns, selected_column } = props;
  return (
    <Popover placement="right" trigger="hover">
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            <PseudoBox
              display="flex"
              alignItems="center"
              width="100%"
              paddingX="10px"
              paddingY="5px"
              marginY="5px"
              justifyContent="space-between"
              _hover={{
                backgroundColor: '#FAFAFA',
              }}
              cursor="pointer"
            >
              <Box display="flex" alignItems="center">
                <Icon size="14px" name={available_properties['PHONE NUMBER'].icon} mr="10px" />
                <Box fontWeight="400" fontSize="14px">
                  {selected_column?.label}
                </Box>
              </Box>
              <Icon size="12px" name="chevron-right" />
            </PseudoBox>
          </PopoverTrigger>
          <PopoverContent
            zIndex={4}
            width="max-content"
            boxShadow="none"
            _focus={{
              boxShadow: 'none',
              outline: 'none',
            }}
          >
            <PopoverWrapper>
              {columns.map((i: any) => (
                <Box
                  key={i.uid}
                  className={`list-item ${selected_column.uid === i.uid ? 'active' : ''}`}
                  width="100%"
                  style={{
                    fontSize: 14,
                  }}
                  onClick={() => {
                    props.onChange(i.uid);
                    if (onClose) onClose();
                  }}
                >
                  <Icon
                    className="icon"
                    name={available_properties['PHONE NUMBER'].icon}
                    size="14px"
                  />
                  {i.label}
                </Box>
              ))}
            </PopoverWrapper>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export const DNDCustomizationMenu = (props: any) => {
  const { column } = props;
  const customization = column?.customization || {};

  const phone_columns: any[] = Object.values(props.columns).filter(
    (i: any) => i.type === 'PHONE NUMBER',
  );

  const tracked_column: any = Object.values(props.columns).find(
    (i: any) => i.id === customization['tracked_column'],
  );

  const handleTrackedColumnChange = (column_uid: string) => {
    const columnID = props.columns[column_uid].id;
    if (tracked_column?.id === columnID) return;
    props.updateCustomization(column.uid, { tracked_column: columnID });
  };

  return (
    <>
      <Box className="property-type-label" marginTop="10px">
        TRACKED PHONE NUMBER COLUMN
      </Box>
      <ColumnSelect
        {...{
          selected_column: tracked_column,
          columns: phone_columns,
          columns_by_id: phone_columns.map((i: any) => i.uid),
          onChange: handleTrackedColumnChange,
        }}
      />
    </>
  );
};
