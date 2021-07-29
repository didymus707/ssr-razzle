import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@chakra-ui/core';
import { PopoverWrapper } from '../../list-view.styles';
import { DateCellEditor, MultiSelectCellEditor, SelectCellEditor } from '../cell-properties';

export const PopoverCellEditor = (props: any) => {
  const [tempValue, setTempValue] = useState(null);
  const cell_position = props.cellPosition;
  const container = useRef();
  const { column, row } = props.cell;

  const customization = column?.customization || {};

  const handleClick = (e: any) => {
    if (!props.isOpen) return;
    let col_id = e.target.parentElement?.attributes?.['row-id']?.value;
    let row_id = e.target.attributes?.['col-id']?.value;
    const same_col = column?.uid === col_id;
    const same_row = row?.uid === row_id;
    if (row_id && col_id && same_col && same_row) return;
    // @ts-ignore
    if (container.current.contains(e.target)) return;
    props.close();
  };

  const attachOutsideClickListener = () => {
    document.addEventListener('mousedown', handleClick);
  };
  const detachOutsideClickListener = () => {
    document.removeEventListener('mousedown', handleClick);
  };

  const handleUpdate = (value: any) => {
    setTempValue(value);
    props.updateCell(value);
    if (column.type === 'DATE') return;
    props.close();
  };

  const resetTempValue = () => {
    setTempValue(null);
  };

  useEffect(() => {
    if (row && column) {
      setTempValue(row.columns?.[column.uid] || '');
    }
    return resetTempValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  useEffect(() => {
    attachOutsideClickListener();
    return detachOutsideClickListener;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const left_overflow = window.innerWidth - (cell_position.left + 280);
  const top_overflow = window.innerHeight - (cell_position.top - 60 + 500);

  return (
    <Box
      width="max-content"
      zIndex={1000000}
      boxShadow="none"
      position="absolute"
      left={cell_position.left + Math.min(left_overflow, 5)}
      top={cell_position.bottom - 60 + Math.min(top_overflow, 5)}
      ref={container}
      maxHeight="500px"
    >
      {props.isOpen && tempValue !== null && (
        <PopoverWrapper>
          {column.type === 'DATE' && (
            <DateCellEditor
              value={tempValue}
              updateValue={handleUpdate}
              customization={customization}
              close={props.close}
            />
          )}
          {column.type === 'SELECT' && (
            <SelectCellEditor
              options={column?.options ? column.options : []}
              value={tempValue}
              updateValue={handleUpdate}
              updateSelectOption={props.updateSelectOption}
            />
          )}
          {column.type === 'MULTI SELECT' && (
            <MultiSelectCellEditor
              options={column?.options ? column.options : []}
              value={tempValue}
              updateValue={handleUpdate}
              updateSelectOption={props.updateSelectOption}
            />
          )}
        </PopoverWrapper>
      )}
    </Box>
  );
};
