import React from 'react';
import { ColumnSelect } from './column-select';
import { OrderSelect } from './order-select';
import { Box, Icon } from '@chakra-ui/core';

export const SortItem = (props: any) => {
  const {
    columns,
    columns_by_id,
    columnID,
    updateSort,
    uid: sort_id,
    deleteSort,
    order: selected_order,
    sorted_columns,
  } = props;

  const handleColumnChange = (columnID: string) => {
    updateSort(sort_id, { columnID: columnID, name: columns[columnID].name });
  };

  const handleOrderChange = (order: string) => {
    updateSort(sort_id, { order });
  };

  const columnType = columns[columnID]?.type;

  return (
    <Box className="sort-item" justifyContent="space-between">
      <ColumnSelect
        {...{
          selected_column: columnID,
          sorted_columns,
          columns,
          columns_by_id,
          onChange: handleColumnChange,
        }}
      />
      <OrderSelect
        {...{
          selected_order,
          onChange: handleOrderChange,
          columnType,
        }}
      />
      <Box className="icon-menu">
        <Icon name="trash" onClick={() => deleteSort(sort_id)} />
      </Box>
    </Box>
  );
};
