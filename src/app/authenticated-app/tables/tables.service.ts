import { AxiosRequestConfig } from 'axios';
import { OptionTypeBase } from 'react-select';
import { client } from '../../../utils';
import { GroupSchema } from './components';
import {
  TablePropertiesOptions,
  ImportRowsMappingOptions,
  TableTemplateTypes,
} from './tables.types';

//////////////////////////////////////////////////////////////
// Tables API Integration

function getTables(params?: AxiosRequestConfig['params']) {
  return client('tables', { params });
}

function createTable(payload: Pick<TablePropertiesOptions, 'user_id' | 'columns'>) {
  return client('tables/create', { data: payload, method: 'POST' });
}

function createTableTemplate(payload: TableTemplateTypes) {
  return client('tables/create_template', { data: payload, method: 'POST' });
}

function updateTable(
  payload: Partial<Omit<TablePropertiesOptions, 'created_datetime' | 'updated_datetime'>>,
) {
  return client('tables/update', { data: payload, method: 'PATCH' });
}

function deleteTable(payload: Pick<TablePropertiesOptions, 'user_id' | 'id'>) {
  return client('tables/delete', { data: payload, method: 'DELETE' });
}

//////////////////////////////////////////////////////////////
// Rows API Integration

function getRows(data: { id?: string; page?: number; limit?: number }) {
  const { id, page, limit } = data;
  const url = `rows/${id}`;
  return client(url, {
    params: { page, limit },
  });
}

async function getRow(id: string) {
  const response = await client(`row/${id}`);
  return response.data.row;
}

function createRow(payload: OptionTypeBase) {
  return client('rows/create', { data: payload, method: 'POST' });
}

async function filterRows(payload: OptionTypeBase) {
  const response = await client('rows/filter', { data: payload, method: 'POST' });
  return response.data.rows;
}

function sortRows(payload: OptionTypeBase) {
  return client('rows/sort', { data: payload, method: 'POST' });
}

function searchRows({
  query,
  table_id,
}: {
  table_id: TablePropertiesOptions['id'];
  query: string;
}) {
  return client(`rows/${table_id}/search`, { params: { query } });
}

function updateRow(payload: { id: string; columns: OptionTypeBase }) {
  return client('rows/update', { data: payload, method: 'PATCH' });
}

function deleteRow(id: string) {
  return client('rows/delete', { data: { id }, method: 'DELETE' });
}

function deleteRowGroup(payload: { id: string[] }) {
  return client('rows/delete', { data: payload, method: 'DELETE' });
}

function importRows(payload: FormData) {
  return client('rows/import', { data: payload, method: 'POST' });
}

function importMapping(payload: ImportRowsMappingOptions) {
  return client('rows/import-mapping', { data: payload, method: 'PATCH' });
}

//////////////////////////////////////////////////////////////
// Groups API Integration

function getGroups(table_id?: string) {
  return client(`groups/${table_id}`);
}

function getGroupRows(params: { id: GroupSchema['id'] }) {
  const { id } = params;
  return client(`groups/${id}/rows`);
}

function createGroup(payload: {
  table_id?: string;
  name: GroupSchema['name'];
  row_id?: (string | undefined)[];
}) {
  return client('groups/create', { data: payload, method: 'POST' });
}

function addRowToGroup(payload: { id: GroupSchema['id']; row_id: (string | undefined)[] }) {
  const { id, row_id } = payload;
  return client(`groups/${id}/rows/add`, { data: { row_id }, method: 'POST' });
}

function deleteRowsFromGroup(payload: { row_id: string[]; id: GroupSchema['id'] }) {
  const { id, row_id } = payload;
  return client(`groups/${id}/rows/remove`, {
    data: { row_id },
    method: 'DELETE',
  });
}

function updateGroup(payload: GroupSchema) {
  return client('groups/update', { data: payload, method: 'PATCH' });
}

function deleteGroup(payload: { id: GroupSchema['id'] }) {
  return client('groups/delete', { data: payload, method: 'DELETE' });
}

//////////////////////////////////////////////////////////////
// Import API Integration

function getImportList() {
  return client('imports');
}

export {
  getRow,
  getRows,
  sortRows,
  createRow,
  updateRow,
  getTables,
  getGroups,
  deleteRow,
  searchRows,
  importRows,
  filterRows,
  updateGroup,
  createGroup,
  deleteGroup,
  updateTable,
  deleteTable,
  createTable,
  getGroupRows,
  addRowToGroup,
  importMapping,
  getImportList,
  deleteRowGroup,
  deleteRowsFromGroup,
  createTableTemplate,
};
