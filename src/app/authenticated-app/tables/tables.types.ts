import { RouteComponentProps } from 'react-router-dom';
import { OptionTypeBase } from 'react-select';
import { GroupSchema, PropertySchema, FilterProps, SortItemOptions } from './components';
import { ConnectedProps } from 'react-redux';
import { stateConnector } from './tables.container';

export interface SelectOptions {
  label: string;
  value: string;
}

export interface TableContactOptions {
  id?: string;
  columns: OptionTypeBase;
  created_datetime?: string;
  updated_datetime?: string;
  [key: string]: any;
}

export interface TablePropertiesOptions {
  id?: string;
  name: string;
  user_id?: string;
  type?: string;
  color?: string;
  icon?: string;
  created_datetime?: string;
  updated_datetime?: string;
  columns: PropertySchema[];
}

export interface TableDataOptions {
  rows: TableContactOptions[];
  table: TablePropertiesOptions;
  params?: { id?: string; page?: number; limit?: number };
}

export interface TableRowOptions {
  id?: string;
  type: string;
  name?: string;
  label: string;
  options?: SelectOptions[];
  columnId: PropertySchema['id'];
  value: string | string[] | null;
}

export interface TableRowDataProps {
  [key: string]: TableRowOptions;
}

export interface DataTableSchema {
  data: any[];
  id?: string;
  name: string;
  type?: string | null;
  properties: PropertySchema[];
}

type PropsWithRedux = ConnectedProps<typeof stateConnector>;
export type TableContainerProps = PropsWithRedux & RouteComponentProps<{ id: string }>;
export type TableComponentProps = TableContainerProps;

export type TablesState = {
  importedData: any | null;
  table: TablePropertiesOptions | {};
  tables: TablePropertiesOptions[];
};

export type GroupsState = {
  groups: GroupSchema[];
  group: GroupSchema | {};
  groupRows: TableContactOptions[];
};

export type RowsState = TableDataOptions;

export type FilterParams = {
  filters?: FilterProps[];
  sorts?: SortItemOptions[];
};

export type ImportRowsOptions = {
  file: File;
  name?: string;
  source?: string;
  agree?: boolean;
  delimiter?: string;
  date_format: string;
};

export type ImportRowsMappingOptions = {
  id?: string;
  date_format?: string;
  mapping: OptionTypeBase;
  extras?: OptionTypeBase;
  table_id: string | undefined;
};

export type TableTemplateTypes = {
  type: TemplateTypes;
};

export type TemplateTypes =
  | 'contact_template'
  | 'sales_crm'
  | 'personal_crm'
  | 'expense_tracker'
  | 'product_inventory';
