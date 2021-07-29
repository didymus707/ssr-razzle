import { OptionTypeBase } from 'react-select';
import { Cell, Column, Row } from 'react-table';
import { ModalContainerOptions } from '../../../../components';
import {
  ImportRowsMappingOptions,
  ImportRowsOptions,
  SelectOptions,
  TablePropertiesOptions,
} from '../../tables.types';

export interface TableEditableCellProps {
  cell: Cell;
  row: Row;
  column: Column;
  updateCellData: (index: number, id: string | number, value: string) => void;
}

export interface DataTableProps {
  data: any[];
  columns: Column[];
  onAddRow?: () => void;
  hasNextPage?: boolean;
  skipPageReset?: boolean;
  isNextPageLoading?: boolean;
  onDeleteRow?: (id: string) => void;
  onExpandRow?: (id: string) => void;
  loadNextPage?: (startIndex: number, stopIndex: number) => Promise<void>;
}

export interface importedData {
  id?: string;
  name?: string;
  status?: number;
  errors?: number;
  source?: string;
  success?: number;
  file_name?: string;
  error_logs?: null;
  delimiter?: string;
  duplicates?: number;
  extras?: OptionTypeBase;
  mapping?: OptionTypeBase;
  object_id?: string | null;
  created_datetime?: string;
  updated_datetime?: string;
  date_format?: string | null;
  columns?: OptionTypeBase[];
  object?: OptionTypeBase | null;
}

export interface TableImportModalProps {
  file: any;
  isNew?: boolean;
  isLoading?: boolean;
  onRemoveFile: () => void;
  importedData: importedData;
  tables: TablePropertiesOptions[];
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
  handleMapping: (payload: ImportRowsMappingOptions) => void;
  handleUpload: ({ file, date_format, source }: ImportRowsOptions) => void;
}

export interface NewTableImportModalProps {
  file: any;
  isLoading?: boolean;
  onRemoveFile: () => void;
  importedData: importedData;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
  handleMapping: (payload: ImportRowsMappingOptions) => void;
  handleCreateTable: (payload: TablePropertiesOptions['columns']) => void;
  handleUpload: ({ file, date_format, source }: ImportRowsOptions) => void;
}

export interface TableDataSchema {
  type?: string;
  value?: string | string[];
  options?: SelectOptions[];
}

export interface TableDropdownItemProps {
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  table: TablePropertiesOptions;
}

export interface TablesDropdownProps {
  isLoading?: boolean;
  children: React.ReactNode;
  data: TablePropertiesOptions[];
  activeTable?: TablePropertiesOptions;
  onDelete?: ({ id, callback }: { id: TablePropertiesOptions['id']; callback: () => void }) => void;
  onClick: (group: TablePropertiesOptions) => void;
}
