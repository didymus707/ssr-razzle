// @ts-nocheck
import React, { useState } from 'react';
import { Icon, Input, Box } from '@chakra-ui/core';

const SelectValueItem = (props: any) => {
  const handleDeleteValue = (event: any) => {
    event.stopPropagation();
    props.delete();
  };

  return (
    <div
      className="value-item"
      style={{
        fontSize: 12,
        backgroundColor: props.color,
        marginRight: 5,
        padding: '2px 5px',
        borderRadius: 2,
        lineHeight: 'normal',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onClick={(e: any) => e.stopPropagation()}
    >
      {props.value}
      <Box
        marginLeft="5px"
        display="flex"
        padding="2.5px"
        borderRadius="2px"
        backgroundColor="rgba(0,0,0,0.1)"
        onClick={handleDeleteValue}
        className="close-icon"
      >
        <Icon name="close" size="8px" cursor="pointer" className="close-icon" />
      </Box>
    </div>
  );
};

const SelectInput = ({ addOption }: any) => {
  const [value, setValue] = useState('');

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  const handleKeyPress = (e: any) => {
    if (e.key !== 'Enter') return;
    if (value === '') return;
    addOption(value);
    setValue('');
  };

  return (
    <Input
      variant="unstyled"
      value={value}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      fontSize="14px"
    />
  );
};

export const SelectCell = (props: any) => {
  const addOption = async (value: string) => {
    const option = await props.addOption(props._column.uid, value);
    const row_index = props.node.rowIndex;
    const row = await props.getRowByIndex(row_index);
    const columnID = props._column.uid;
    const row_id = row['uid'];
    await props.updateCellValue([option.id], row_id, columnID);
  };

  const deleteValue = async () => {
    const row_index = props.node.rowIndex;
    const row = await props.getRowByIndex(row_index);
    const columnID = props._column.uid;
    const row_id = row['uid'];
    props.updateCellValue([], row_id, columnID);
  };

  let value = props.value;
  if (Array.isArray(props.value)) value = value[0];
  const options = props._column?.options
    ? props._column.options.filter((i: any) => !i.isDeleted)
    : [];
  const selected_option = options.find((i: any) => i.id === value);

  return (
    <div className="select-cell" style={{ display: 'flex', alignItems: 'center' }}>
      <div>
        {selected_option && (
          <SelectValueItem
            value={selected_option.name}
            color={selected_option.color}
            delete={deleteValue}
            id={selected_option.id}
          />
        )}
      </div>
      <SelectInput addOption={addOption} />
    </div>
  );
};
