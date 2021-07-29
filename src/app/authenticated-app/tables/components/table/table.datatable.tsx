import * as React from 'react';
import { Wrapper } from './table.styles';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

export function ListTable({ _columns, _rows }: any) {
  const rows: Array<object> = _rows.map((i: any) => i.columns);

  const onFirstDataRendered = (params: any) => {
    if (_columns.length < 8) params.api.sizeColumnsToFit();
  };

  return (
    <Wrapper>
      <div id="ListGrid" className="ag-theme-alpine">
        <AgGridReact
          rowData={rows}
          rowDragManaged
          animateRows
          onFirstDataRendered={onFirstDataRendered}
        >
          {_columns.map((i: any, index: number) => (
            <AgGridColumn
              key={i.id}
              field={String(i.id)}
              headerName={i.label}
              rowDrag={index === 0}
              checkboxSelection={index === 0}
              resizable
              sortable
              filter
            />
          ))}
        </AgGridReact>
      </div>
      <div className="footing">Hello</div>
    </Wrapper>
  );
}
