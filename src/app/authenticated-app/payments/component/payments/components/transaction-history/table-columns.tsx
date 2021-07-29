import React from 'react';
import { capitalize } from 'lodash';
import { Box, Icon } from '@chakra-ui/core';
import { formatToCurrency } from '../../../../../inbox/inbox.utils';
import {
  getTransactionHistoryTypeIcon,
  getTransactionHistoryTypeColor,
} from '../../../../payments.utils';
import moment from 'moment';

export const TransactionHistoryTableColumns = () => [
  {
    Header: 'Amount',
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return <Box fontWeight="500">₦ {formatToCurrency(original.amount)}</Box>;
    },
  },
  {
    Header: 'Description',
    width: 300,
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return (
        <Box color="#757575" textAlign="left">
          {original.description}
        </Box>
      );
    },
  },
  {
    Header: 'TRX Code',
    accessor: 'code',
    Cell: ({ value }: any) => <Box color="#757575">{value}</Box>,
  },
  {
    Header: 'Type',
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px"
          fontSize="12px"
          fontWeight="500"
          width="max-content"
          padding="2px 10px"
          color={getTransactionHistoryTypeColor(original)['text']}
          backgroundColor={getTransactionHistoryTypeColor(original)['bg']}
        >
          <Icon name={getTransactionHistoryTypeIcon(original)} mr="5px" />
          {capitalize(original.type)}
        </Box>
      );
    },
  },
  {
    Header: 'Date',
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return <Box>{moment(original.created_datetime).format('DD/MM, H:mm A')}</Box>;
    },
  },
];
