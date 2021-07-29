import React, { SyntheticEvent } from 'react';
import {
  Box,
  Icon,
  IconButton,
  MenuItem,
  MenuButton,
  Menu,
  MenuList,
  useDisclosure,
} from '@chakra-ui/core';
import { formatToCurrency } from '../../../../../inbox/inbox.utils';
import { capitalize } from 'lodash';
import {
  getPaymentRequestStatusColor,
  getPaymentRequestStatusDate,
  getPaymentRequestStatusIcon,
  getPaymentRequestStatusText,
} from '../../../../payments.utils';
import { PaymentRequestCancelDialog } from './cancel-dialog';
import { PaymentRequestMarkPaidDialog } from './mark-paid-dialog';

const OptionItem = (props: { onClick?: Function; icon: string; label: string; color?: string }) => (
  <MenuItem
    // @ts-ignore
    onClick={props?.onClick}
    color={props.color}
    fontSize="12px"
  >
    <Icon name={props.icon} size="14px" mr="10px" color={props.color} />
    {props.label}
  </MenuItem>
);

export const PaymentRequestTableColumns = ({
  copy_request_link,
  cancel_request,
  mark_request_paid,
}: any) => [
  {
    Header: 'Customer',
    width: 220,
    accessor: '',
    Cell: ({ row: { original } }: any) => {
      return (
        <Box display="flex" flexDirection="column">
          <Box fontWeight="500">{original.platform_name}</Box>
          <Box fontSize="11px" color="#757575">
            {capitalize(original.channel_name)}
          </Box>
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
    Header: 'Invoice #',
    accessor: 'invoice_number',
    Cell: ({ value }: any) => <Box color="#757575">{value || '-'}</Box>,
  },
  {
    Header: 'Order Type',
    accessor: '',
    Cell: ({ row: { original } }: any) => (
      <Box color="#757575">{capitalize(original.order_type || '-')}</Box>
    ),
  },
  {
    Header: 'Amount',
    width: 220,
    accessor: '',
    Cell: ({ row: { original } }: any) => (
      <Box fontWeight="500">₦ {formatToCurrency(original.amount)}</Box>
    ),
  },
  {
    Header: 'Status',
    accessor: '',
    Cell: ({ row: { original } }: any) => (
      <Box display="flex" flexDirection="column" justifyContent="center">
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
          color={getPaymentRequestStatusColor(original)['text']}
          backgroundColor={getPaymentRequestStatusColor(original)['bg']}
        >
          <Icon name={getPaymentRequestStatusIcon(original)} mr="5px" />
          {getPaymentRequestStatusText(original)}
        </Box>
        <Box mt="4px" fontSize="11px" color="#757575">
          {getPaymentRequestStatusDate(original)}
        </Box>
      </Box>
    ),
  },
  {
    Header: '',
    accessor: 'id',
    width: 100,
    Cell: ({ row: { original } }: any) => {
      const {
        isOpen: isCancelDialogOpen,
        onOpen: openCancelDialog,
        onClose: closeCancelDialog,
      } = useDisclosure();

      const {
        isOpen: isMarkPaidDialogOpen,
        onOpen: openMarkPaidDialog,
        onClose: closeMarkPaidDialog,
      } = useDisclosure();

      return (
        <>
          <Menu>
            <MenuButton
              as={IconButton}
              // @ts-ignore
              icon="overflow"
              size="sm"
              padding=".5rem"
              variant="ghost"
              height="auto"
              minWidth="auto"
              onClick={(event: SyntheticEvent) => event.stopPropagation()}
            />
            <MenuList minWidth="150px" placement="bottom">
              {!original.expired && !original.paid && !original.cancelled && (
                <>
                  <OptionItem
                    icon="delete"
                    label="Cancel request"
                    color="#E73D51"
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation();
                      openCancelDialog();
                    }}
                  />
                  <OptionItem
                    icon="check"
                    label="Mark as paid"
                    // color="#E73D51"
                    onClick={(e: SyntheticEvent) => {
                      e.stopPropagation();
                      openMarkPaidDialog();
                    }}
                  />
                </>
              )}
              <OptionItem
                icon="copy"
                label="Copy request link"
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  copy_request_link(original);
                }}
              />
            </MenuList>
          </Menu>
          <PaymentRequestCancelDialog
            isOpen={isCancelDialogOpen}
            onClose={closeCancelDialog}
            payment_request={original}
            cancel_request={cancel_request}
          />
          <PaymentRequestMarkPaidDialog
            isOpen={isMarkPaidDialogOpen}
            onClose={closeMarkPaidDialog}
            payment_request={original}
            mark_request_paid={mark_request_paid}
          />
        </>
      );
    },
  },
];
