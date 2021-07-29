export interface List {
  id: string;
  name: string;
  columns: Column[];
  icon: string | null;
  color: string | null;
}

export interface SmartList {
  id: string;
  name: string;
  list_id: string;
  filters: any[];
  icon: string | null;
  color: string | null;
}

export type MetaProps = {
  page: number;
  per_page: number;
  count: number;
  next_page: boolean;
  prev_page: boolean;
};

export interface Position {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SelectColumnOption {
  id: string | number;
  label: string;
  value: string;
  color?: string;
  is_deleted: boolean;
}

export interface Column {
  id: number | string;
  uid?: string;
  label: string;
  name: string;
  type: string;
  options?: SelectColumnOption[];
  customization?: { [key: string]: any };
}

export type ListImportType =
  | 'csv'
  | 'ms-excel'
  | 'apple-numbers'
  | 'calendar'
  | 'contacts'
  | 'asana'
  | 'trello'
  | 'ms-access'
  | 'google-sheets'
  | 'mysql';

export type ListImportStage = 'options' | 'file-upload' | 'mapping';

export type ListVisualization = 'grid' | 'list';

export interface ResourceType {
  key: string;
  label: string;
  disabled: boolean;
  type: 'database' | 'api' | 'app';
  icon: string;
  passwordAuth?: boolean;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  provider: string;
  provider_data: { [key: string]: any };
  organisation_id: string;
  access_expiry: any;
  status: string;
  created_datetime: string;
}

export interface DataModel {
  id: string;
  name: string;
  description: string;
  columns: DataModelColumn[];
  created_datetime: string;
}

export interface DataModelColumn {
  id: string;
  data_model_id: string;
  resource_id: string;
  source_type: string;
  source: string;
  sub_source: string;
  relationship: { [key: string]: any };
  key: string;
  code: string;
  name: string;
  description: string;
  kind: string;
}

export interface Segment {
  id: string;
  data_model_id: string;
  name: string;
  description: string;
  color: string;
  is_deleted: boolean;
}
