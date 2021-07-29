// @ts-nocheck
import React, { useEffect, useState, useRef } from 'react';
import { ListGridWrapper } from './index.styles';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { HeaderNew } from './header-new';
import { HeaderSelect } from './header-select';
import { Header } from './header';
import { MetaProps } from '../../lists.types';
import { RowNew } from './row-new';
import { GridColumnMenu } from './column-menu';
import { default_editable_properties } from '../../list.data';
import { PopoverCellEditor } from './popover-cell-editor';
import { CustomCell } from './custom-cell';
import { getColumnHeaderIcon } from '../../lists.utils';
import { RowSelectCell } from './row-select-cell';
import { RecordModal } from '../record-modal/index.container';
import { useSelector } from 'react-redux';
import { Box } from '@chakra-ui/core';
import { selectActiveSubscription } from '../../../settings';
import { EmptyState } from '../../../../components';
import noDataImage from '../../assets/no-data.svg';
import { Spinner } from '@chakra-ui/core/dist';

const PAGE_LIMIT: number = Number(process.env.REACT_APP_PAGINATION_LIMIT) || 200;
const SCROLL_THRESHOLD_RATIO: number = 0.7;

const default_cell = {
  row: null,
  column: null,
};

export const ListGrid = (props: any) => {
  const gridApi = useRef();
  const gridViewport = useRef();

  // @ts-ignore
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeCell, setActiveCell] = useState({
    row: null,
    column: null,
  });
  const [activeCellPosition, setActiveCellPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [rowNodeOpen, setRowNodeOpen] = useState<null | string>(null);

  const openRow = async (index: any) => {
    const row = await props.getRowByIndex(index);
    const node = gridApi.current.getRowNode(row.uid);
    setRowNodeOpen(node);
  };
  const closeRow = () => setRowNodeOpen(null);

  const rows: Array<object> = props.rows_by_id
    .filter((i: string) => !!props.rows?.[i]?.columns)
    .map((i: string) => ({
      ...props.rows?.[i]?.columns,
      uid: i,
    }));

  const columns: Array<object> = props.columns_by_id
    .map((i: string) => props.columns[i])
    .filter((column: any) => !column.hidden);
  const meta: MetaProps = props.meta;
  const list: {
    id: string;
  } = props.list;

  const row_count: number = props.meta.count_total;
  const visible_rows: number = props.rows_by_id.length;

  const attachCellEditingStartedListener = (event: any) => {
    if (!gridViewport.current) return;
    if (!gridApi.current) return;
    if (gridViewport.current.contains(event.target)) return;
    if (!event.view.location.pathname.includes('/s/lists')) return;
    if (event.target.className === 'ag-react-container') return;
    gridApi.current.stopEditing();
    onCellEditingStopped();
  };

  const onCellEditingStarted = () => {
    document.addEventListener('click', attachCellEditingStartedListener);
  };

  const onCellEditingStopped = () => {
    document.removeEventListener('click', attachCellEditingStartedListener);
  };

  const onCellValueChanged = (params: any) => {
    const row_index = params.node.childIndex;
    const columnID = params.colDef.field;
    const value = params.newValue;
    onCellEditingStopped();
    props.updateRowCell({ row_index, columnID, value });
    return true;
  };

  const updateCellValue = (value: any, row_id?: string, columnID?: string) => {
    props.updateRowCell({
      row_id: activeCell.row?.uid || row_id,
      columnID: activeCell.column?.uid || columnID,
      value,
    });
  };

  const handleBodyScroll = (params: any) => {
    if (params.direction === 'horizontal') {
      // handle horizontal scroll debounce
    } else handlePagination(params);
  };

  const handlePagination = (params: any) => {
    // handle pagination
    if (props.rows_loading) return;
    if (!meta.next_page) return;
    const last_displayed_row: number = params.api.getLastDisplayedRow();
    const scroll_threshold = meta.page * PAGE_LIMIT * SCROLL_THRESHOLD_RATIO;
    if (!(last_displayed_row >= scroll_threshold)) return;
    props.fetchRows({ list: list.id, page: meta.page + 1 });
  };

  const handleSelectionChanged = (params: any) => {
    const selected_row_indices = params.api.getSelectedNodes().map((node: any) => {
      return node.rowIndex;
    });
    props.selectRows(selected_row_indices);
  };

  const handleRowClick = (params: any) => {
    if (checkNewColCell(params)) handleNewRowClick();
  };

  const handleNewColumnClick = async () => {
    gridApi.current.stopEditing();
    const column = await props.createColumn();
    await gridApi.current.gridPanel.eCenterViewport.scrollTo({
      left: 1000000000000000,
      behavior: 'auto',
    });
    setTimeout(() => setActiveColumn(column['uid']), 100);
  };

  const active_subscription: any = useSelector(selectActiveSubscription);
  let allow_create_row: boolean = false;
  if (!active_subscription?.details?.lists?.rows) allow_create_row = true;
  else if (active_subscription.details.lists.rows > rows.length) allow_create_row = true;

  const handleNewRowClick = () => {
    if (allow_create_row) {
      props.createRow();
      gridViewport.current.scrollTop = gridViewport.current.scrollHeight;
    } else {
      props.openNoSubscriptionModal({
        heading: "Oops, looks like you've run out of available rows on your list",
        subHeading: `Upgrade to our business plan to create lists and smart lists with unlimited rows.
         All lists you create are currently capped at ${active_subscription.details.lists.rows.toLocaleString()} rows`,
      });
    }
  };

  const handleCellClicked = (params: any) => {
    const col_id = params.colDef.field;
    if (['_select', '_new'].includes(col_id)) return;

    const column = props.columns[col_id];
    const row_index = params.node.rowIndex;
    const row_id = props.rows_by_id[row_index];
    const row = { ...props.rows[row_id], index: row_index };

    if (default_editable_properties.includes(column.type)) return;
    if (column.type === 'DND') return;

    const target_element = params.event.target;
    let element_class = target_element?.attributes?.['class']?.value || '';
    if (element_class.includes('close-icon')) return;
    const parent_element = target_element.parentElement;
    element_class = parent_element?.attributes?.['class']?.value || '';
    if (element_class.includes('close-icon')) return;

    const cell_target = params.event.target;

    const rect = cell_target.getBoundingClientRect();
    setActiveCellPosition({
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
    });
    setActiveCell({
      row,
      column,
    });
  };

  const checkNewColCell = (params: any) => !!params.data.new_col;

  const onGridReady = (params: any) => {
    gridApi.current = params.api;
    gridViewport.current = params.api.gridPanel.eBodyViewport;
    setInitialWidths();
  };

  const setInitialWidths = () => {
    const widthPayload = Object.values(props.columns)
      .filter((i: any) => !!i.width)
      .map((i: any) => ({ key: i.uid, newWidth: i.width }));

    gridApi.current.columnController.columnApi.setColumnWidths(widthPayload);
  };

  const cleanupRefs = () => {
    document.removeEventListener('click', attachCellEditingStartedListener);
    gridApi.current = null;
    gridViewport.current = null;
  };

  useEffect(() => {
    return cleanupRefs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const attachNewColumnClickListener = () => {
    const elems: HTMLCollection = document.getElementsByClassName('ag-header-cell');
    for (let i = 0; i < elems.length; i++) {
      if (i === elems.length - 1) elems[i].addEventListener('click', handleNewColumnClick);
    }
  };

  const handleDeletePressed = (event: any) => {
    const platform = window.navigator.platform;
    if (platform.includes('Mac')) handleMacDeletePressed(event);
    else handleOtherDeletePressed(event);
  };

  const handleMacDeletePressed = (event: any) => {
    if (event.key !== 'Backspace') return;
    if (event.metaKey) props.deleteRows();
    else props.clearRows();
  };
  const handleOtherDeletePressed = (event: any) => {
    if (event.key === 'Backspace') props.clearRows();
    if (event.key === 'Delete') props.deleteRows();
  };

  const attachDeleteKeyPressedListener = () => {
    const grid_element = document.getElementById('ListGrid');
    if (!grid_element?.parentElement) return;
    grid_element.parentElement.addEventListener('keydown', handleDeletePressed);
  };

  const handleColumnClick = (event: any) => {
    const columnID = event.target.getAttribute('col-id');
    if (event.which !== 3) return;
    // @ts-ignore
    if (activeColumn === columnID) setActiveColumn(null);
    else setActiveColumn(columnID);
  };

  const closeColumnMenu = () => setActiveColumn(null);

  const handleColumnResize = params => {
    const { finished, source } = params;
    if (!finished) return;
    if (source === 'api') return;
    const affectedColumns = params.columns.filter((i: any) => i && i.colId !== '_new');
    affectedColumns.forEach((i: any) => {
      props.updateColumn(i.colId, { width: i.actualWidth });
    });
  };

  const handleDeleteColumn = (columnID: string) => {
    closeColumnMenu();
    props.deleteColumn(columnID);
  };

  const handleHideColumn = (columnID: string) => {
    closeColumnMenu();
    props.hideColumn(columnID);
  };

  const handleUpdateColumnLabel = (columnID: string, label: string) => {
    props.updateColumnLabel(columnID, label);
  };

  const handleUpdateColumnType = (columnID: string, type: string) => {
    props.updateColumnType(columnID, type);
  };

  const handleUpdateColumn = (columnID: string, payload: {}) => {
    props.updateColumn(columnID, payload);
  };

  const closePopoverCellEditor = () => {
    setActiveCell(default_cell);
  };

  const handleAddSelectOption = (columnID: string, value: string) =>
    props.addSelectOption(columnID, value);

  const handleUpdateSelectOption = (option_id: string | number, payload: object) => {
    const columnID = activeCell?.column?.uid;
    props.updateSelectOption(columnID, option_id, payload);
  };

  useEffect(() => {
    attachNewColumnClickListener();
    attachDeleteKeyPressedListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getColumnOptions = (columnID: string) => {
    return props.columns[columnID]?.options || [];
  };

  const getColumn = (columnID: string) => {
    return props.columns[columnID];
  };

  const handleGetRowNodeID = (row: any) => row.uid;

  const popover_cell_editor_open: boolean = !!activeCell.row && !!activeCell.column;
  const allow_scroll: boolean = !activeColumn && !popover_cell_editor_open;

  const filtered_columns = Object.values(props.filters).reduce((acc, i: any) => {
    if (acc.includes(i.columnID)) return acc;
    return [...acc, i.columnID];
  }, []);

  const sorted_columns = Object.values(props.sorts).reduce((acc, i: any) => {
    if (acc.includes(i.columnID)) return acc;
    return [...acc, i.columnID];
  }, []);

  // @ts-ignore
  return (
    <>
      {!!rowNodeOpen && (
        <RecordModal
          {...{
            isOpen: !!rowNodeOpen,
            onClose: closeRow,
            node: rowNodeOpen,
            openRow,
          }}
        />
      )}
      <GridColumnMenu
        columnID={activeColumn}
        // @ts-ignore
        column={props.columns[activeColumn]}
        columns={props.columns}
        isOpen={!!activeColumn}
        close={closeColumnMenu}
        deleteColumn={handleDeleteColumn}
        hideColumn={handleHideColumn}
        updateLabel={handleUpdateColumnLabel}
        updateType={handleUpdateColumnType}
        updateColumn={handleUpdateColumn}
        enrichColumnData={props.enrichColumnData}
        updateCustomization={props.updateColumnCustomization}
      />
      <PopoverCellEditor
        isOpen={!!activeCell.row && !!activeCell.column}
        close={closePopoverCellEditor}
        cellPosition={activeCellPosition}
        cell={{ row: activeCell.row, column: props.columns[activeCell.column?.uid] }}
        updateCell={updateCellValue}
        updateSelectOption={handleUpdateSelectOption}
      />
      <ListGridWrapper
        // @ts-ignore
        allowScroll={allow_scroll}
      >
        <div id="ListGrid" className="ag-theme-alpine">
          <AgGridReact
            rowDragManaged
            animateRows
            suppressScrollOnNewData
            suppressColumnVirtualisation
            singleClickEdit
            rowData={!props.is_smart_list ? [...rows, { new_col: true }] : rows}
            onGridReady={onGridReady}
            onBodyScroll={handleBodyScroll}
            applyColumnDefOrder
            onCellEditingStarted={onCellEditingStarted}
            onCellEditingStopped={onCellEditingStopped}
            suppressDragLeaveHidesColumns
            onColumnResized={handleColumnResize}
            rowMultiSelectWithClick
            suppressRowClickSelection
            suppressCellSelection
            onSelectionChanged={handleSelectionChanged}
            onRowClicked={handleRowClick}
            isFullWidthCell={checkNewColCell}
            onCellClicked={handleCellClicked}
            fullWidthCellRendererFramework={RowNew}
            rowSelection="multiple"
            immutableData
            getRowNodeId={handleGetRowNodeID}
            enableCellChangeFlash={false}
            suppressPropertyNamesCheck
            rowHeight={40}
          >
            <AgGridColumn
              key="_select"
              field="_select"
              width={60}
              maxWidth={60}
              minWidth={60}
              headerComponentFramework={HeaderSelect}
              headerComponentParams={{
                selectRows: props.selectRows,
              }}
              suppressSizeToFit
              suppressMovable
              lockPosition
              pinned="left"
              cellRendererFramework={RowSelectCell}
              cellRendererParams={{
                selectRows: props.selectRows,
                openRow,
              }}
              headerHeight={40}
            />
            {columns.map((i: any, index) => {
              return (
                <AgGridColumn
                  key={i.uid}
                  field={String(i.uid)}
                  headerName={i.label}
                  minWidth={100}
                  defaultWidth={i.width}
                  suppressMovable
                  headerComponentFramework={Header}
                  valueSetter={onCellValueChanged}
                  headerHeight={40}
                  headerComponentParams={{
                    activeColumn,
                    setActiveColumn,
                    handleColumnClick,
                    getColumn,
                    icon: getColumnHeaderIcon(i.type),
                  }}
                  cellRendererParams={{
                    addOption: handleAddSelectOption,
                    getColumnOptions,
                    updateCellValue,
                    closePopoverCellEditor,
                    getRowByIndex: props.getRowByIndex,
                    search_query: props.search_query,
                  }}
                  cellRendererFramework={CustomCell}
                  cellStyle={{
                    backgroundColor: filtered_columns.includes(i.uid)
                      ? '#f2fff2'
                      : sorted_columns.includes(i.uid)
                      ? '#fff4f2'
                      : undefined,
                  }}
                  editable={default_editable_properties.includes(i?.type)}
                  resizable
                  pinned={index === 0 && 'left'}
                  flex={index === columns.length && 1}
                />
              );
            })}
            <AgGridColumn
              headerHeight={40}
              key="_new"
              field="_new"
              headerComponentFramework={HeaderNew}
              resizable={false}
              minWidth={50}
              flex={1}
            />
          </AgGridReact>
        </div>
        {row_count === 0 && (
          <Box
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
            top="calc(calc(100vh - 10rem)/2)"
            left="calc(calc(100vw - 10rem)/2)"
            width="10rem"
            height="10rem"
          >
            {!props.rows_loading && (
              <EmptyState
                image={noDataImage}
                heading="Oops, no data here"
                headingProps={{ fontSize: '16px' }}
              />
            )}
            {props.rows_loading && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
              />
            )}
          </Box>
        )}
        <div className="footing">
          {visible_rows.toLocaleString()} of {row_count.toLocaleString()} record(s) shown
        </div>
      </ListGridWrapper>
    </>
  );
};
