import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OptionTypeBase } from 'react-select';
import { AppDispatch } from '../../../root';
import { GroupSchema } from './components';
import * as tablesService from './tables.service';
import {
  GroupsState,
  ImportRowsMappingOptions,
  RowsState,
  TableContactOptions,
  TableDataOptions,
  TablePropertiesOptions,
  TablesState,
  TableTemplateTypes,
} from './tables.types';
import { addList } from '../lists';

////////////////////////////////////////////////////////////////////////////////////

const tablesInitialState: TablesState = {
  table: {},
  tables: [],
  importedData: null,
};

const groupsInitialState: GroupsState = {
  group: {},
  groups: [],
  groupRows: [],
};

const rowsInitialState: RowsState = {
  rows: [],
  table: {} as TablePropertiesOptions,
};

////////////////////////////////////////////////////////////////////////////////////

const tablesSlice = createSlice({
  name: 'tables',
  initialState: tablesInitialState,
  reducers: {
    getTableList(state, action: PayloadAction<{ tables: TablePropertiesOptions[] }>) {
      const { tables } = action.payload;
      state.tables = tables;
    },
    createTableItem(state, action: PayloadAction<{ table: TablePropertiesOptions }>) {
      const { table } = action.payload;
      state.table = table;
      state.tables?.push(table);
    },
    updateTableItem(state, action: PayloadAction<{ table: TablePropertiesOptions }>) {
      const { table } = action.payload;
      const index = state.tables?.findIndex(item => item.id === table.id);
      state.tables[index] = table;
    },
    deleteTableItem(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      state.tables = state.tables.filter(item => item.id !== id);
    },
    importSuccess(state, action: PayloadAction<{ importedData: any }>) {
      const { importedData } = action.payload;
      state.importedData = importedData;
    },
    importMappingSuccess(state) {
      state.importedData = null;
    },
  },
});

export const {
  getTableList,
  importSuccess,
  deleteTableItem,
  createTableItem,
  updateTableItem,
  importMappingSuccess,
} = tablesSlice.actions;

////////////////////////////////////////////////////////////////////////////////////

const groupsSlice = createSlice({
  name: 'groups',
  initialState: groupsInitialState,
  reducers: {
    getGroupList(state, action: PayloadAction<{ groups: GroupSchema[] }>) {
      const { groups } = action.payload;
      state.groups = groups;
    },
    createGroupItem(state, action) {
      const { group } = action.payload;
      state.groups?.push(group);
    },
    updateGroupItem(state, action: PayloadAction<{ group: GroupSchema }>) {
      const { group } = action.payload;
      const index = state.groups.findIndex(item => item.id === group.id);
      state.groups[index] = group;
    },
    deleteGroupItem(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      state.groups = state.groups.filter(item => item.id !== id);
    },
    getGroupRowList(state, action: PayloadAction<{ rows: TableContactOptions[] }>) {
      const { rows } = action.payload;
      state.groupRows = rows;
    },
    updateGroupRowItem(state, action: PayloadAction<{ row: TableContactOptions }>) {
      const { row } = action.payload;
      state.groupRows?.map(item => {
        if (item.id === row.id) {
          return row;
        }
        return item;
      });
    },
  },
});

export const {
  getGroupList,
  createGroupItem,
  updateGroupItem,
  deleteGroupItem,
  getGroupRowList,
  updateGroupRowItem,
} = groupsSlice.actions;

////////////////////////////////////////////////////////////////////////////////////

const rowsSlice = createSlice({
  name: 'rows',
  initialState: rowsInitialState,
  reducers: {
    getRowsList(state, action: PayloadAction<TableDataOptions>) {
      const { rows, table, params } = action.payload;
      state.rows = params?.page && params.page > 1 ? [...state.rows, ...rows] : rows;
      state.table = table;
    },
    createRowItem(state, action: PayloadAction<{ row: TableContactOptions }>) {
      const { row } = action.payload;
      state.rows?.push(row);
    },
    updateRowItem(state, action: PayloadAction<{ row: TableContactOptions }>) {
      const { row } = action.payload;
      const index = state.rows.findIndex(item => item.id === row.id);
      state.rows[index] = row;
    },
    deleteRowItem(state, action: PayloadAction<{ id: string }>) {
      const { id } = action.payload;
      state.rows = state.rows.filter(item => item.id !== id);
    },
  },
  extraReducers: builder => {
    builder.addCase(getGroupRowList, (state, action) => {
      const { rows } = action.payload;
      state.rows = rows;
      return state;
    });
    builder.addCase(updateTableItem, (state, action) => {
      const { table } = action.payload;
      state.table = table;
    });
  },
});

export const { getRowsList, createRowItem, updateRowItem, deleteRowItem } = rowsSlice.actions;

////////////////////////////////////////////////////////////////////////////////////

export const tablesReducer = tablesSlice.reducer;
export const groupsReducer = groupsSlice.reducer;
export const rowsReducer = rowsSlice.reducer;

////////////////////////////////////////////////////////////////////////////////////
// table Thunks

export const fetchTables = (params?: any) => async (dispatch: AppDispatch) => {
  const response = await tablesService.getTables(params);
  const { tables } = response.data;
  dispatch(getTableList({ tables }));
  return response.data;
};

export const addTable = (
  payload: Pick<TablePropertiesOptions, 'user_id' | 'columns' | 'name' | 'color' | 'icon'>,
) => async (dispatch: AppDispatch) => {
  const response = await tablesService.createTable(payload);
  const { table } = response.data;
  dispatch(addList(table))
  return response.data;
};

export const addTableFromTemplate = (payload: TableTemplateTypes) => async (
  dispatch: AppDispatch,
) => {
  const response = await tablesService.createTableTemplate(payload);
  const { table } = response.data;
  dispatch(addList(table))
  return response.data;
};

export const editTable = (
  payload: Partial<Omit<TablePropertiesOptions, 'created_datetime' | 'updated_datetime'>>,
) => async (dispatch: AppDispatch) => {
  const response = await tablesService.updateTable(payload);
  const { table } = response.data;
  dispatch(updateTableItem({ table }));
  return response.data;
};

export const removeTable = (payload: Pick<TablePropertiesOptions, 'user_id' | 'id'>) => async (
  dispatch: AppDispatch,
) => {
  const { id } = payload;
  const response = await tablesService.deleteTable(payload);
  if (id) {
    dispatch(deleteTableItem({ id }));
  }
  return response;
};

////////////////////////////////////////////////////////////////////////////////////
// Groups Thunks

export const fetchGroups = (id?: string) => async (dispatch: AppDispatch) => {
  const response = await tablesService.getGroups(id);
  const { groups } = response.data;
  dispatch(getGroupList({ groups }));
  return response.data;
};

export const addGroup = (payload: {
  table_id?: string;
  name: GroupSchema['name'];
  row_id?: (string | undefined)[];
}) => async (dispatch: AppDispatch) => {
  const response = await tablesService.createGroup(payload);
  const { group } = response.data;
  dispatch(createGroupItem({ group }));
  return response.data;
};

export const editGroup = (payload: GroupSchema) => async (dispatch: AppDispatch) => {
  const response = await tablesService.updateGroup(payload);
  const { group } = response.data;
  dispatch(updateGroupItem({ group }));
  return response.data;
};

export const removeGroup = (payload: { id: GroupSchema['id'] }) => async (
  dispatch: AppDispatch,
) => {
  const { id } = payload;
  const response = await tablesService.deleteGroup(payload);
  id && dispatch(deleteGroupItem({ id }));
  return response;
};

export const fetchGroupRows = (params: { id: GroupSchema['id'] }) => async (
  dispatch: AppDispatch,
) => {
  const response = await tablesService.getGroupRows(params);
  const { group } = response.data;
  if (group && group.rows) {
    dispatch(getGroupRowList({ rows: group.rows }));
  }
  return response.data;
};

export const addGroupRows = (payload: {
  row_id: (string | undefined)[];
  id: GroupSchema['id'];
}) => async () => {
  const { id } = payload;
  const response = await tablesService.addRowToGroup(payload);
  fetchGroupRows({ id });
  return response;
};

export const removeGroupRows = (payload: {
  row_id: string[];
  id: GroupSchema['id'];
}) => async () => {
  const { id } = payload;
  const response = await tablesService.deleteRowsFromGroup(payload);
  fetchGroupRows({ id });
  return response;
};

export const editGroupRow = (payload: { id: string; columns: OptionTypeBase }) => async (
  dispatch: AppDispatch,
) => {
  const response = await tablesService.updateRow(payload);
  const { row } = response.data;
  dispatch(updateGroupRowItem({ row }));
  return response;
};

////////////////////////////////////////////////////////////////////////////////////
// Rows Thunks

export const fetchRows = (params: { id?: string; page?: number; limit?: number }) => async (
  dispatch: AppDispatch,
) => {
  const response = await tablesService.getRows(params);
  const { rows, table } = response.data;
  dispatch(getRowsList({ rows, table, params }));
  return response.data;
};

export const removeRow = (id: string) => async (dispatch: AppDispatch) => {
  const response = await tablesService.deleteRow(id);
  dispatch(deleteRowItem({ id }));
  return response;
};

export const filterRowsData = (params?: any) => async (dispatch: AppDispatch) => {
  const response = await tablesService.filterRows(params);
  const { rows, table } = response.data;
  dispatch(getRowsList({ rows, table }));
  return response.data;
};

export const sortRowsData = (params?: any) => async (dispatch: AppDispatch) => {
  const response = await tablesService.sortRows(params);
  const { rows, table } = response.data;
  dispatch(getRowsList({ rows, table }));
  return response.data;
};

export const searchRowsData = (params: {
  query: string;
  table_id: TablePropertiesOptions['id'];
}) => async (dispatch: AppDispatch) => {
  const response = await tablesService.searchRows(params);
  const { rows, table } = response.data;
  dispatch(getRowsList({ rows, table }));
  return response.data;
};

export const addRow = (payload: OptionTypeBase) => async (dispatch: AppDispatch) => {
  const response = await tablesService.createRow(payload);
  const { row } = response.data;
  dispatch(createRowItem({ row }));
  return response.data;
};

export const editRow = (payload: { id: string; columns: OptionTypeBase }) => async (
  dispatch: AppDispatch,
) => {
  const response = await tablesService.updateRow(payload);
  const { row } = response.data;
  dispatch(updateRowItem({ row }));
  return response.data;
};

export const importRowsCSV = (payload: any) => async (dispatch: AppDispatch) => {
  const response = await tablesService.importRows(payload);
  const { import: importedData, columns } = response.data;
  dispatch(importSuccess({ importedData: { ...importedData, columns } }));
  return response.data;
};

export const importRowsMapping = (payload: ImportRowsMappingOptions) => async (
  dispatch: AppDispatch,
) => {
  const response = await tablesService.importMapping(payload);
  dispatch(importMappingSuccess());
  return response.data;
};
