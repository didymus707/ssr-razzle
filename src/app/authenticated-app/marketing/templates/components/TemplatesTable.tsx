import * as React from 'react';
import { usePagination, useTable } from 'react-table';
import { TableStyles } from '../templates.styles';
import { TemplateTablePagination } from './TemplateTablePagination';
import { TemplateTableProps } from './types';

export function TemplatesTable<T extends object>({
  columns,
  data,
}: React.PropsWithChildren<TemplateTableProps>): React.ReactElement {
  const initialState = {};
  const tableInstance = useTable<T | {}>({ columns, data, initialState }, usePagination);
  const { page, prepareRow, headerGroups, getTableProps, getTableBodyProps } = tableInstance;
  return (
    <TableStyles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {data.length > 10 && <TemplateTablePagination<T> instance={tableInstance} />}
    </TableStyles>
  );
}
