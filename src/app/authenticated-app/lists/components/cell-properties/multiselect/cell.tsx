import React, { useState } from 'react';
import { Box, Icon, Input } from '@chakra-ui/core';

const MultiSelectValueItem = (props: any) => {
  const handleDeleteValue = (event: any) => {
    event.stopPropagation();
    props.delete(props.id);
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

const MultiSelectInput = ({ addOption }: any) => {
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

export const MultiSelectCell = (props: any) => {
  let value = props.value;
  if (!Array.isArray(props.value) && value) value = [value];
  if (!value) value = [];
  let options = props._column.options || [];
  options = options.filter((i: any) => !i.isDeleted);
  // eslint-disable-next-line
  const selected_options = options.filter((i: any) => value.some((val: any) => val == i.id));

  const addOption = async (option_name: string) => {
    const option = await props.addOption(props._column.uid, option_name);
    const row_index = props.node.rowIndex;
    const row = await props.getRowByIndex(row_index);
    const columnID = props._column.uid;
    const row_id = row['uid'];
    await props.updateCellValue([...value, option.id], row_id, columnID);
  };

  const deleteValue = async (option_id: string | number) => {
    const row_index = props.node.rowIndex;
    const row = await props.getRowByIndex(row_index);
    const columnID = props._column.uid;
    const row_id = row['uid'];
    const updated_value = selected_options
      .filter((option: any) => option.id !== option_id)
      .map((option: any) => option.id);
    props.updateCellValue(updated_value, row_id, columnID);
  };

  return (
    <div className="select-cell" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex' }}>
        {selected_options.map((option: any) => (
          <MultiSelectValueItem
            value={option.name}
            color={option.color}
            delete={deleteValue}
            key={option.id}
            id={option.id}
          />
        ))}
      </div>
      <MultiSelectInput addOption={addOption} />
    </div>
  );
};
