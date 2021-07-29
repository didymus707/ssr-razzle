import { ResourceType } from './lists.types';

export const default_editable_properties = ['TEXT', 'NUMBER', 'EMAIL', 'PHONE NUMBER', 'URL'];

export const available_properties = {
  TEXT: {
    label: 'Text',
    key: 'TEXT',
    icon: 'text',
    description: 'A single line of text',
    system: false,
  },
  NUMBER: {
    label: 'Number',
    key: 'NUMBER',
    icon: 'number',
    description: 'A valid number value',
    system: false,
  },
  EMAIL: {
    label: 'Email',
    key: 'EMAIL',
    icon: 'email',
    description: 'A valid email address (e.g. andrew@example.com).',
    system: false,
  },
  'PHONE NUMBER': {
    label: 'Phone',
    key: 'PHONE NUMBER',
    icon: 'phone',
    description: 'A telephone number (e.g. 08097392637)',
    system: false,
  },
  DATE: {
    label: 'Date',
    key: 'DATE',
    icon: 'day',
    description: 'A valid date or time value, with customizable display options',
    system: false,
  },
  SELECT: {
    label: 'Select',
    key: 'SELECT',
    icon: 'select',
    description:
      'Single select allows you to select a single option from predefined options in a dropdown',
    system: false,
  },
  'MULTI SELECT': {
    label: 'Multiselect',
    key: 'MULTI SELECT',
    icon: 'multi-select',
    description: 'Multiple select allows you to select one or more predefined options listed',
    system: false,
  },
  URL: {
    label: 'URL',
    key: 'URL',
    icon: 'link',
    description: 'A valid URL (e.g. simpu.co or https://simpu.co/terms).',
    system: false,
  },
  DND: {
    label: 'DND',
    key: 'DND',
    icon: 'moon',
    description:
      'A background check on a phone number property to check the SMS delivery status of a number',
    system: true,
  },
};

export const customizable_properties = ['DATE'];

export const available_conjunctions = {
  and: {
    key: 'and',
    label: 'And',
  },
  or: {
    key: 'or',
    label: 'Or',
  },
};

export const available_sort_orders = {
  ASC: {
    key: 'ASC',
    label: 'Ascending',
  },
  DESC: {
    key: 'DESC',
    label: 'Descending',
  },
};

const date_comparison_sub_operators = [
  'today',
  'tomorrow',
  'yesterday',
  'one week ago',
  'one week from now',
  'one month ago',
  'one month from now',
  'number of days from now',
  'exact date',
];

// const date_between_sub_operators = [
//   'the past week',
//   'the past month',
//   'the past year',
//   'the next week',
//   'the next month',
//   'the next year',
//   'one month from now',
//   'the next number of days',
//   'the past number of days',
// ];

export const available_operators = {
  equals: {
    key: 'equals',
    label: 'Is',
    column_types: ['TEXT', 'PHONE NUMBER', 'NUMBER', 'EMAIL', 'URL', 'DND'],
  },
  notEqual: {
    key: 'notEqual',
    label: 'Is not',
    column_types: ['TEXT', 'PHONE NUMBER', 'EMAIL', 'NUMBER', 'URL', 'DND'],
  },
  less: {
    key: 'less',
    label: 'less than (<)',
    column_types: ['NUMBER'],
  },
  lessEq: {
    key: 'lessEq',
    label: 'less or equal to (≤)',
    column_types: ['NUMBER'],
  },
  greater: {
    key: 'greater',
    label: 'greater than (>)',
    column_types: ['NUMBER'],
  },
  greaterEq: {
    key: 'greaterEq',
    label: 'greater or equal to (≥)',
    column_types: ['NUMBER'],
  },
  dateEqual: {
    key: 'dateEqual',
    label: 'Is',
    column_types: ['DATE'],
    subOperators: date_comparison_sub_operators,
  },
  dateNotEqual: {
    key: 'dateNotEqual',
    label: 'Is not',
    column_types: ['DATE'],
    subOperators: date_comparison_sub_operators,
  },
  dateBefore: {
    key: 'dateBefore',
    label: 'Is before',
    column_types: ['DATE'],
    subOperators: date_comparison_sub_operators,
  },
  dateAfter: {
    key: 'dateAfter',
    label: 'Is after',
    column_types: ['DATE'],
    subOperators: date_comparison_sub_operators,
  },
  dateOnBefore: {
    key: 'dateOnBefore',
    label: 'Is on or before',
    column_types: ['DATE'],
    subOperators: date_comparison_sub_operators,
  },
  dateOnAfter: {
    key: 'dateOnAfter',
    label: 'Is on or after',
    column_types: ['DATE'],
    subOperators: date_comparison_sub_operators,
  },
  // dateBetween: {
  //   key: 'dateBetween',
  //   label: 'Is within',
  //   column_types: ['DATE'],
  //   subOperators: date_between_sub_operators,
  // },
  // startsWith: {
  //   key: 'startsWith',
  //   label: 'Starts with',
  //   column_types: ['TEXT', 'PHONE NUMBER', 'EMAIL', 'URL'],
  // },
  // endsWith: {
  //   key: 'endsWith',
  //   label: 'Ends with',
  //   column_types: ['TEXT', 'PHONE NUMBER', 'EMAIL', 'URL'],
  // },
  isAnyOf: {
    key: 'isAnyOf',
    label: 'Is any of',
    column_types: ['SELECT'],
  },
  isNoneOf: {
    key: 'isNoneOf',
    label: 'Is none of',
    column_types: ['SELECT', 'MULTI SELECT'],
  },
  hasAnyOf: {
    key: 'hasAnyOf',
    label: 'Has any of',
    column_types: ['MULTI SELECT'],
  },
  hasAllOf: {
    key: 'hasAllOf',
    label: 'Has all of',
    column_types: ['MULTI SELECT'],
  },
  hasExactly: {
    key: 'hasExactly',
    label: 'Has exactly',
    column_types: ['SELECT', 'MULTI SELECT'],
  },
  empty: {
    key: 'empty',
    label: 'Is empty',
    column_types: [
      'TEXT',
      'PHONE NUMBER',
      'EMAIL',
      'URL',
      'NUMBER',
      'SELECT',
      'MULTI SELECT',
      'DND',
    ],
  },
  notEmpty: {
    key: 'notEmpty',
    label: 'Is not empty',
    column_types: [
      'TEXT',
      'PHONE NUMBER',
      'EMAIL',
      'URL',
      'NUMBER',
      'SELECT',
      'MULTI SELECT',
      'DND',
    ],
  },
  contains: {
    key: 'contains',
    label: 'Contains',
    column_types: ['TEXT', 'PHONE NUMBER', 'EMAIL', 'URL'],
  },
  notContain: {
    key: 'notContain',
    label: 'Does not contain',
    column_types: ['TEXT', 'PHONE NUMBER', 'EMAIL', 'URL'],
  },
};

export const select_option_colors = [
  {
    label: 'Gray',
    color: '#0f0f0f1a',
  },
  {
    label: 'Brown',
    color: '#8c2e0033',
  },
  {
    label: 'Orange',
    color: '#f55d0033',
  },
  {
    label: 'Yellow',
    color: '#e9a80033',
  },
  {
    label: 'Green',
    color: '#00876b33',
  },
  {
    label: 'Blue',
    color: '#0078df33',
  },
  {
    label: 'Purple',
    color: '#6724de33',
  },
  {
    label: 'Pink',
    color: '#dd008133',
  },
  {
    label: 'Red',
    color: '#ff001a33',
  },
];

export const list_option_colors = [
  'rgba(15,15,15, 0.8)',
  'rgba(140,46,0, 0.8)',
  'rgba(245,93,0, 0.8)',
  'rgba(233,168,0, 0.8)',
  'rgba(0,135,107, 0.8)',
  'rgba(0,120,223, 0.8)',
  'rgba(103,36,222, 0.8)',
  'rgba(221,0,129, 0.8)',
  'rgba(255, 64, 129, 1)',
  'rgba(224, 64, 251, 1)',
  'rgba(105, 240, 174, 1)',
  'rgba(255, 171, 64, 1)',
  'rgba(213, 0, 0, 1)',
  'rgba(15, 109, 142, 1)',
  'rgba(83, 109, 254, 1)',
  'rgba(64, 196, 255, 1)',
  'rgba(30, 83, 143, 1)',
  'rgba(161, 116, 85, 1)',
];

export const available_date_formats = [
  {
    label: 'European',
    format: 'D/MM/YYYY',
  },
  {
    label: 'Friendly',
    format: 'Do MMMM YYYY',
  },
  {
    label: 'US',
    format: 'MM/D/YYYY',
  },

  {
    label: 'ISO',
    format: 'YYYY-MM-D',
  },
  {
    label: 'Relative',
    format: 'relative',
  },
];

export const available_time_formats = [
  {
    label: '12 Hour',
    format: 'h:mm A',
  },
  {
    label: '24 Hour',
    format: 'H:mm',
  },
];

export const calendarOutputFormat = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'LL',
};

export const resource_types: ResourceType[] = [
  {
    key: 'mysql',
    label: 'MySQL',
    disabled: false,
    type: 'database',
    icon: 'mysql',
  },
  {
    key: 'pgsql',
    label: 'PostgreSQL',
    disabled: false,
    type: 'database',
    icon: 'postgresql',
  },
  {
    key: 'mongodb',
    label: 'Mongo DB',
    disabled: true,
    type: 'database',
    icon: 'mongodb',
  },
  {
    key: 'elastic-search',
    label: 'Elastic Search',
    disabled: true,
    type: 'database',
    icon: 'elasticsearch',
  },
  {
    key: 'google-sheets',
    label: 'Google Sheets',
    disabled: false,
    type: 'api',
    icon: 'g-sheets',
  },
  {
    key: 'shopify',
    label: 'Shopify',
    disabled: false,
    type: 'app',
    icon: 'shopify',
  },
  {
    key: 'woo-commerce',
    label: 'WooCommerce',
    disabled: false,
    type: 'app',
    icon: 'woo-commerce',
  },
  {
    key: 'mambu',
    label: 'Mambu',
    disabled: false,
    type: 'app',
    icon: 'mambu',
    passwordAuth: true
  },
  {
    key: 'paystack',
    label: 'Paystack',
    disabled: true,
    type: 'api',
    icon: 'paystack',
  },
  {
    key: 'flutterwave',
    label: 'Flutterwave',
    disabled: true,
    type: 'api',
    icon: 'flutterwave-2',
  },
  {
    key: 'stripe',
    label: 'Stripe',
    disabled: true,
    type: 'api',
    icon: 'stripe-2',
  },
];
