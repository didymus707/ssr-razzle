import React from 'react';
import { Box } from '@chakra-ui/core';
import { useTable, useRowSelect, useBlockLayout } from 'react-table';
import { TableWrapper as Wrapper } from './table.styles';

interface Props {
  columns: [];
  data: [];
  onRowClick: Function;
}

export const Table = ({ columns, data, onRowClick }: Props) => {
  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    [],
  );

  const { rows, prepareRow, headerGroups, getTableProps, getTableBodyProps }: any = useTable(
    {
      data,
      columns,
      defaultColumn,
    },
    useBlockLayout,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => columns);
    },
  );

  return (
    <Wrapper>
      <div {...getTableProps()} className="table">
        <div className="thead">
          {headerGroups.map((headerGroup: any) => (
            <div {...headerGroup.getHeaderGroupProps()} className="tr">
              {headerGroup.headers.map((column: any) => (
                <div {...column.getHeaderProps()} className="th">
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()} className="tbody">
          {rows.map((row: any) => {
            prepareRow(row);
            return (
              <Box
                {...row.getRowProps()}
                className="tr"
                cursor="pointer"
                onClick={() => {
                  if (onRowClick) onRowClick(row.original);
                }}
              >
                {row.cells.map((cell: any) => {
                  return (
                    <div {...cell.getCellProps()} className="td">
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </Box>
            );
          })}
        </div>
      </div>
    </Wrapper>
  );
};
