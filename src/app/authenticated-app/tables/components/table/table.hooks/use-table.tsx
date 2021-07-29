import { Button, useToast } from '@chakra-ui/core';
import * as React from 'react';
import { OptionTypeBase } from 'react-select';
import { useBlockLayout, useResizeColumns, useTable } from 'react-table';
import { LoadingActions } from '../../../../../../hooks';
import { ToastBox } from '../../../../../components';
import { User } from '../../../../../unauthenticated-app/authentication';
import { SelectOptions, TablePropertiesOptions } from '../../../tables.types';
import { getRowApiValue } from '../../../tables.utils';
import { PropertyDropdown, PropertySchema } from '../../property';
import { EditableCell } from '../table.components';
import { usePropertiesAsync } from './use-columns-async';

export function useDataTable({
  user,
  tableId,
  actions,
  tableData,
  loadingDispatch,
  onPropertyChange,
  properties: propertiesProp,
}: {
  actions: any;
  tableData: any;
  tableId?: string;
  user: User | null;
  properties: PropertySchema[];
  onPropertyChange?(payload: Pick<TablePropertiesOptions, 'columns' | 'id' | 'user_id'>): void;
  loadingDispatch: React.Dispatch<LoadingActions>;
}) {
  const { addRow, editRow, editTable } = actions;
  const [data, setData] = React.useState<OptionTypeBase[]>(tableData);
  const [columns, setColumns] = React.useState<PropertySchema[]>(propertiesProp);
  const toast = useToast();

  const properties = usePropertiesAsync({
    user,
    tableId,
    properties: columns,
    onChange: onPropertyChange,
  });

  const tableColumns = React.useMemo(
    () => [
      {
        width: 80,
        accessor: '_opt',
      },
      ...properties.properties
        .filter(({ hidden }: PropertySchema) => !hidden)
        .map(({ name, label, width }: PropertySchema) => ({
          Header: label,
          accessor: name,
          width: width || 300,
        })),
      {
        width: 220,
        Header: () => (
          <PropertyDropdown onChange={properties.onPropertyAdd}>
            <Button
              size="xs"
              alignItems="center"
              width="100%"
              height={35}
              leftIcon="add"
              variant="ghost"
              borderRadius="0"
              paddingY="0.5rem"
              _focus={{ boxShadow: 'none' }}
            >
              New
            </Button>
          </PropertyDropdown>
        ),
        accessor: 'new',
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [properties.properties],
  );

  React.useEffect(() => {
    setData(tableData);
  }, [tableData]);

  React.useEffect(() => {
    setColumns(propertiesProp);
  }, [propertiesProp]);

  async function handleAddRow() {
    const newRow = {} as any;
    const apiRow = {} as any;

    properties.properties.forEach((prop: PropertySchema) => {
      if (prop.options) {
        newRow[prop.name] = {
          value: '',
          options: prop.options,
          type: prop.type.toLowerCase(),
        };
      } else {
        newRow[prop.name] = { type: prop.type.toLowerCase(), value: '' };
      }
      if (prop.id) {
        apiRow[prop.id] = '';
      }
    });
    setData([...data, newRow]);

    try {
      loadingDispatch({ type: 'GLOBAL_LOADING_STARTED' });
      await addRow({ columns: apiRow, table_id: tableId });
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
    } catch (error) {
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  async function handleEditTable(columnName: string | number, options: PropertySchema['options']) {
    const updatedColumns = columns.map((column: PropertySchema) => {
      if (column.name === columnName) {
        return { ...column, options };
      }
      return column;
    });
    try {
      loadingDispatch({ type: 'GLOBAL_LOADING_STARTED' });
      await editTable({
        id: tableId,
        user_id: user?.id,
        columns: updatedColumns,
      });
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
    } catch (error) {
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  async function handleEditRow(row: OptionTypeBase) {
    const { id, ...columns } = row;

    try {
      loadingDispatch({ type: 'GLOBAL_LOADING_STARTED' });
      await editRow({ id, columns });
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
    } catch (error) {
      loadingDispatch({ type: 'GLOBAL_LOADING_RESOLVED' });
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => <ToastBox onClose={onClose} message={error} />,
      });
    }
  }

  function handleDataChange(
    rowIndex: number,
    columnId: string,
    value: any,
    options?: SelectOptions[],
  ) {
    let updatedRow = {};
    if (options) {
      updatedRow = {
        ...data[rowIndex],
        [columnId]: { ...data[rowIndex][columnId], value, options },
      };
    } else {
      updatedRow = {
        ...data[rowIndex],
        [columnId]: { ...data[rowIndex][columnId], value },
      };
    }

    const newData = data.map((row: any, index: number) => {
      if (index === rowIndex) {
        return updatedRow;
      }
      return row;
    });
    setData(newData);

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

  const defaultColumn = {
    Cell: EditableCell,
  };

  const tableProps = useTable(
    {
      data,
      defaultColumn,
      columns: tableColumns,
      //@ts-ignore
      updateTableData: handleDataChange,
    },
    useBlockLayout,
    useResizeColumns,
  );

  return { tableProps, properties, handleAddRow };
}
