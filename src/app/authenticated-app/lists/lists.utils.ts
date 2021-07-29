import {
  TextCellComponent,
  TextFieldComponent,
  EmailCell,
  EmailFieldComponent,
  NumberFieldComponent,
  PhoneCell,
  PhoneFieldComponent,
  SelectCell,
  SelectFieldComponent,
  MultiSelectCell,
  MultiSelectFieldComponent,
  URLCell,
  DateCell,
  DateFieldComponent,
  DNDCell,
  DNDFieldComponent,
  DNDFieldFilterComponent,
} from './components/cell-properties';
import { DateCustomizationMenu } from './components/cell-properties';
import { available_properties, select_option_colors, list_option_colors } from './list.data';
import { icons } from 'feather-icons';
import moment from 'moment';

export const getCellRenderer = (columnType: string) => {
  if (columnType === 'MULTI SELECT') return MultiSelectCell;
  if (columnType === 'SELECT') return SelectCell;
  if (columnType === 'EMAIL') return EmailCell;
  if (columnType === 'PHONE NUMBER') return PhoneCell;
  if (columnType === 'URL') return URLCell;
  if (columnType === 'DATE') return DateCell;
  if (columnType === 'DND') return DNDCell;
  return TextCellComponent;
};

export const getFieldRenderer = (columnType: string) => {
  if (columnType === 'TEXT') return TextFieldComponent;
  if (columnType === 'EMAIL') return EmailFieldComponent;
  if (columnType === 'NUMBER') return NumberFieldComponent;
  if (columnType === 'PHONE NUMBER') return PhoneFieldComponent;
  if (columnType === 'DATE') return DateFieldComponent;
  if (columnType === 'MULTI SELECT') return MultiSelectFieldComponent;
  if (columnType === 'SELECT') return SelectFieldComponent;
  if (columnType === 'DND') return DNDFieldComponent;
  return TextFieldComponent;
};

export const getFilterFieldRenderer = (columnType: string) => {
  if (columnType === 'TEXT') return TextFieldComponent;
  if (columnType === 'EMAIL') return EmailFieldComponent;
  if (columnType === 'NUMBER') return NumberFieldComponent;
  if (columnType === 'PHONE NUMBER') return PhoneFieldComponent;
  if (columnType === 'DATE') return DateFieldComponent;
  if (columnType === 'MULTI SELECT') return MultiSelectFieldComponent;
  if (columnType === 'SELECT') return MultiSelectFieldComponent;
  if (columnType === 'DND') return DNDFieldFilterComponent;
  return TextFieldComponent;
};

export const getColumnCustomizationComponent = (columnType: string) => {
  if (columnType === 'DATE') return DateCustomizationMenu;
};

export const getColumnHeaderIcon = (columnType: string) => {
  // @ts-ignore
  if (available_properties[columnType]) return available_properties[columnType].icon;
  return 'text';
};

export const getRowApiValue = (row: any) => {
  const { id, ...rest } = row;
  let result = { id } as any;
  Object.keys(rest).forEach(item => {
    const columnId = rest[item].columnId;
    if (columnId) {
      result[columnId] = rest[item].value;
    }
  });
  return result;
};

export const generateUpdatedRows = (row_ids: [], rows: {}, column_id_map: {}) => {
  const updated_rows = row_ids.map((i: string) => {
    // @ts-ignore
    const row = rows[i];
    const columns = Object.keys(row.columns).reduce(
      (acc, col_uid) => ({
        ...acc,
        // @ts-ignore
        [column_id_map[col_uid]]: row.columns[col_uid],
      }),
      {},
    );
    const updated_row = {
      ...row,
      columns,
    };
    return updated_row;
  });
  return updated_rows;
};

export const generateFilterPayload = (
  filters: {},
  filters_by_id: any[],
  column_id_map: {},
  columns = {},
) => {
  const payload = filters_by_id.map((i: string) => {
    // @ts-ignore
    const filter = filters[i];
    const col_uid = filter['columnID'];

    const filter_item = {
      ...filter,
      // @ts-ignore
      columnID: column_id_map[col_uid],
      // @ts-ignore
      columnType: columns?.[col_uid]['type'],
    };

    if (filter_item.columnType === 'DATE') {
      const { subOperator } = filter;
      if (subOperator === 'today') filter_item['value'] = { diff: '0', period: 'day' };
      if (subOperator === 'tomorrow') filter_item['value'] = { diff: '+1', period: 'day' };
      if (subOperator === 'yesterday') filter_item['value'] = { diff: '-1', period: 'day' };
      if (subOperator === 'one week ago') filter_item['value'] = { diff: '-7', period: 'day' };
      if (subOperator === 'one week from now') filter_item['value'] = { diff: '+7', period: 'day' };
      if (subOperator === 'one month ago') filter_item['value'] = { diff: '-1', period: 'month' };
      if (subOperator === 'one month from now')
        filter_item['value'] = { diff: '+1', period: 'month' };
      if (subOperator === 'number of days from now') {
        filter_item['value'] = {
          diff: filter_item['value'] ? `+${filter_item['value']}` : '0',
          period: 'day',
        };
      }
    }

    delete filter_item.uid;
    return filter_item;
  });

  return payload;
};

export const generateSortPayload = (
  sorts: {},
  sorts_by_id: [],
  column_id_map: {},
  columns = {},
) => {
  const payload = sorts_by_id.map((i: string) => {
    // @ts-ignore
    const sort = sorts[i];
    const sort_item = {
      ...sort,
      // @ts-ignore
      columnType: columns?.[sort.columnID]['type'],
      // @ts-ignore
      columnID: column_id_map?.[sort.columnID],
    };
    delete sort_item.uid;
    // delete sort_item.columnID;
    return sort_item;
  });
  return payload;
};

export const generateRandomSelectColor = () => {
  const index = Math.floor(Math.random() * select_option_colors.length);
  return select_option_colors[index].color;
};

export const generateRandomListColor = () => {
  const index = Math.floor(Math.random() * list_option_colors.length);
  return list_option_colors[index];
};

export const generateRandomListIcon = () => {
  const icon_options = Object.keys(icons);
  const index = Math.floor(Math.random() * icon_options.length);
  return icon_options[index];
};

export const parseDate = (raw: string) => {
  let parsed = moment(raw);
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'D/MM/YYYY');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'D/MM/YY');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'D-MM-YYYY');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'D-MM-YY');
  if (parsed.isValid()) return parsed;
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'D MM YYYY');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'D MM YY');
  return parsed;
};

export const parseTime = (raw: string) => {
  let parsed = moment(raw, 'hh:mm A');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'HH:mm A');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'h:mm A');
  if (parsed.isValid()) return parsed;
  parsed = moment(raw, 'H:mm A');
  return parsed;
};

export const sortListByTime = (a: any, b: any) => {
  if (moment(a.created_datetime).isAfter(moment(b.created_datetime))) return 1;
  else return -1;
};

export const getListResourceIcon = (resource_provider: string) => {
  if (resource_provider === 'google-sheets') return 'g-sheets';
  if (resource_provider === 'mysql') return 'mysql';
  if (resource_provider === 'pgsql') return 'postgreSql';
  if (resource_provider === 'shopify') return 'shopify';
  if (resource_provider === 'woo-commerce') return 'woo-commerce';
  if (resource_provider === 'mambu') return 'mambu';
  return 'copy';
};

export const getAllowCreateList = (activeSubscription: any, listCount: number) => {
  let allowCreateList: boolean = false;
  if (!activeSubscription?.details?.lists?.lists) allowCreateList = true;
  else if (activeSubscription.details.lists.lists > listCount) allowCreateList = true;

  return allowCreateList;
};

export const wait = (timeout: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};
