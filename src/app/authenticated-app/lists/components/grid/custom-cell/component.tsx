import React from 'react';
import { getCellRenderer } from '../../../lists.utils';

export const CustomCellComponent = (props: any) => {
  const { columns, ...rest } = props;

  const columnID = props.column.colId;
  const column = props.columns[columnID];
  const columnType = column?.type;

  const Component = getCellRenderer(columnType);

  if (!Component) return <div>{props.value || ''}</div>;

  return <Component {...rest} _column={column} />;
};
