import { defaultProperties } from './components';
import { DataTableSchema } from './tables.types';

export const seedData = {
  contacts: [
    {
      id: '780789e4146311eaaad8ca342e7f26ca',
      columns: {
        '1': 'Kolawole Balogun',
        '2': '2018-01-01',
        '3': 'Male',
        '4': '+19294297270',
      },
      createdDatetime: '2019-12-01T17:53:23',
      updatedDatetime: '2019-12-01T17:53:23',
    },
  ],
  table: {
    id: '7e8fe1ee0ecc11eaaad8ca342e7f26ca',
    name: 'contact',
    columns: [
      {
        id: 1,
        name: 'Name',
        type: 'TEXT',
        label: 'Name',
        hidden: true,
      },
      {
        id: 2,
        name: 'datecol',
        type: 'DATE',
        label: 'datecol',
        hidden: true,
      },
      {
        id: 3,
        label: 'Choices',
        name: 'choices',
        type: 'SELECT',
        options: [
          {
            id: 1,
            name: 'one',
            type: 'option',
          },
          {
            id: 2,
            name: 'two',
            type: 'option',
          },
        ],
        hidden: true,
      },
      {
        id: 4,
        hidden: true,
        name: 'MSISDN',
        type: 'PHONE_NUMBER',
        label: 'MSISDN',
      },
    ],
    createdDatetime: '2019-11-24T15:10:04',
    updatedDatetime: '2019-12-01T17:53:09',
  },
};

export const expectedData = [
  {
    id: '780789e4146311eaaad8ca342e7f26ca',
    name: {
      type: 'TEXT',
      value: 'Kolawole Balogun',
      columnId: 1,
    },
    datecol: { type: 'DATE', value: '2018-01-01', columnId: 2 },
    choices: {
      type: 'SELECT',
      value: 'Male',
      columnId: 3,
      options: [
        {
          label: 'one',
          value: 'one',
        },
        {
          label: 'two',
          value: 'two',
        },
      ],
    },
    msisdn: { type: 'PHONE_NUMBER', value: '+19294297270', columnId: 4 },
  },
];

export const DEFAULTTABLE = {
  data: [],
  id: undefined,
  name: 'Table',
  properties: defaultProperties,
} as DataTableSchema;

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export function makeData(...lens: any) {
  const makeDataLevel: any = (depth: any = 0) => {
    const len = lens[depth];
    return range(len).map(d => {
      return {
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
