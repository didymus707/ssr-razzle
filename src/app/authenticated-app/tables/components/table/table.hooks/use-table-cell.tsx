import { useToast } from '@chakra-ui/core';
import * as React from 'react';
import isEqual from 'lodash/isEqual';
import { OptionTypeBase } from 'react-select';
import { Row } from 'react-table';
import { ToastBox } from '../../../../../components';
import { SelectOptions } from '../../../tables.types';
import { getRowApiValue } from '../../../tables.utils';
import { PropertySchema } from '../../property';
import { TableSelect, TableCellClickable } from '../table.components';

/**
 * Hook to generate table cell editable element base on column type
 */

export function useColumnCell({
  type,
  user,
  props,
  columns,
  editRow,
  tableId,
  editTable,
  updateTableData,
  loadingDispatch,
}: any) {
  const {
    data,
    cell: {
      value: initialValue,
      row: { index: rowIndex },
      column: { id: columnIndex },
    },
  } = props;

  const [inputValue, setInputValue] = React.useState(initialValue && initialValue.value);

  const [selectValue, setSelectValue] = React.useState(initialValue && initialValue.value);

  const toast = useToast();

  async function handleEditTable(columnName: string | number, options: PropertySchema['options']) {
    const updatedColumns = columns.map((column: PropertySchema) => {
      if (column.name === columnName) {
        return { ...column, options };
      }
      return column;
    });
    loadingDispatch({ type: 'GLOBAL_LOADING_STARTED' });
    await editTable({ id: tableId, user_id: user?.id, columns: updatedColumns });
    loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
  }

  async function handleEditRow(row: OptionTypeBase) {
    const { id, ...columns } = row;

    try {
      loadingDispatch({ type: 'GLOBAL_LOADING_STARTED' });
      await editRow({ id, columns });
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message="Row updated" />,
      });
    } catch (error) {
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  function getMultiSelectValue() {
    if (initialValue && initialValue.value) {
      return Array.isArray(initialValue.value)
        ? initialValue.value.map((item: string) => ({
            value: item,
            label: item,
          }))
        : [initialValue.value].map((item: string) => ({
            value: item,
            label: item,
          }));
    }
    return [];
  }

  function getSelectValue() {
    return {
      value: initialValue && initialValue.value,
      label: initialValue && initialValue.value,
    };
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
  }

  function onInputChange2(value?: string) {
    setInputValue(value);
  }

  function onSelectChange(value: SelectOptions | SelectOptions[]) {
    if (Array.isArray(value)) {
      setSelectValue(value.map(item => item.value));
    } else {
      if (value) {
        setSelectValue(value.value);
      } else {
        setSelectValue(value);
      }
    }
  }

  function updateCellData(rowIndex: number, columnId: string | number, value: string | string[]) {
    const currentValue = data[rowIndex][columnId].value;
    if (!isEqual(value, currentValue)) {
      const updatedRow = {
        ...data[rowIndex],
        [columnId]: { ...data[rowIndex][columnId], value },
      };
      const newData = data.map((row: Row, index: number) => {
        if (index === rowIndex) {
          return updatedRow;
        }
        return row;
      });
      updateTableData(newData);

      //generate API payload and make update request
      const apiRow = getRowApiValue(updatedRow);
      handleEditRow(apiRow);
    }
  }

  function updateCellDataOptions(
    rowIndex: number,
    columnId: string | number,
    value: string | string[] | undefined,
    options: SelectOptions[],
  ) {
    const updatedRow = {
      ...data[rowIndex],
      [columnId]: {
        ...data[rowIndex][columnId],
        value,
        options,
      },
    };
    const newData = data.map((row: Row, index: number) => {
      if (index === rowIndex) {
        return updatedRow;
      }
      return row;
    });
    updateTableData(newData);

    // generate API payload and make update request
    const apiRow = getRowApiValue(updatedRow);
    handleEditRow(apiRow);

    // update table columns with options in case a new option has been created by user
    if (options) {
      const formatOptions = options.map(({ value }) => ({
        name: value,
        type: 'option',
      }));
      handleEditTable(columnId, formatOptions);
    }
  }

  switch (type.toLowerCase()) {
    case 'text':
    case 'person':
    case 'number':
      return (
        <input
          className="input"
          value={inputValue}
          onChange={onInputChange}
          onBlur={() => {
            updateCellData(rowIndex, columnIndex, inputValue);
          }}
        />
      );
    case 'date':
      return (
        <input
          type="date"
          className="input"
          value={inputValue}
          onChange={onInputChange}
          onBlur={() => updateCellData(rowIndex, columnIndex, inputValue)}
        />
      );
    case 'url':
      return (
        <TableCellClickable
          icon="link"
          target="_blank"
          inputType="url"
          url={inputValue}
          value={inputValue}
          tooltipLabel="Open link"
          defaultValue={inputValue}
          onChange={onInputChange2}
          onBlur={() => updateCellData(rowIndex, columnIndex, inputValue)}
        />
      );
    case 'email':
      return (
        <TableCellClickable
          icon="at-sign"
          inputType="email"
          value={inputValue}
          tooltipLabel="Send email"
          defaultValue={inputValue}
          onChange={onInputChange2}
          url={`mailto: ${inputValue}`}
          onBlur={() => updateCellData(rowIndex, columnIndex, inputValue)}
        />
      );
    case 'phone number':
      return (
        <TableCellClickable
          icon="phone"
          inputType="tel"
          value={inputValue}
          tooltipLabel="Call"
          defaultValue={inputValue}
          onChange={onInputChange2}
          url={`tel: ${inputValue}`}
          onBlur={() => updateCellData(rowIndex, columnIndex, inputValue)}
        />
      );
    case 'multi select':
      return (
        <TableSelect
          isMulti
          placeholder=""
          onChange={onSelectChange}
          value={getMultiSelectValue()}
          defaultValue={getMultiSelectValue()}
          options={initialValue && initialValue.options}
          onCreateOptions={(options, value) =>
            updateCellDataOptions(rowIndex, columnIndex, value, options)
          }
          onBlur={() => updateCellData(rowIndex, columnIndex, selectValue)}
        />
      );
    case 'select':
      return (
        <TableSelect
          placeholder=""
          onChange={onSelectChange}
          value={getSelectValue()}
          defaultValue={getSelectValue()}
          options={initialValue && initialValue.options}
          onCreateOptions={(options, value) =>
            updateCellDataOptions(rowIndex, columnIndex, value, options)
          }
          onBlur={() => updateCellData(rowIndex, columnIndex, selectValue)}
        />
      );

    default:
      return null;
  }
}
