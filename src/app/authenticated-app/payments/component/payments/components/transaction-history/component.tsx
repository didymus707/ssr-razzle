import React, { useEffect, useState } from 'react';
import { ManagedAccountTransaction, PaymentSetupStatus } from '../../../../payments.types';
import { useSelector } from 'react-redux';
import { selectPaymentSetupStatus } from '../../../../selectors';
import { TransactionHistoryToolbar } from './toolbar';
import { Box, Spinner } from '@chakra-ui/core';
import { TransactionHistoryTableColumns } from './table-columns';
import { Table } from '../components/table';
import { EmptyState, Pagination } from '../../../../../../components';
import noPaymentRequests from '../../../../assets/no-payment-requests.svg';

export const TransactionHistoryComponent = (props: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all');
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const [page, setPage] = useState<number>(1);

  const {
    managed_account: { transactions },
  } = props;

  const { by_id, data, meta, loading } = transactions;

  const rows: ManagedAccountTransaction[] = by_id.map((i: string) => data[i]);

  const onNextPage = () => setPage(page + 1);
  const onPrevPage = () => setPage(page - 1);
  const onGoToPage = (i: number) => setPage(i);

  const columns = React.useMemo(
    () => TransactionHistoryTableColumns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // @ts-ignore
  const setup_status: PaymentSetupStatus = useSelector(selectPaymentSetupStatus);

  useEffect(() => {
    if (setup_status === 'completed') {
      props.fetchManagedAccountTransactions(page, activeTab, searchQuery, dateRange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab, searchQuery, dateRange]);

  return (
    <>
      <Box className="section-title">
        <Box className="title">Transaction History</Box>
      </Box>
      <TransactionHistoryToolbar
        {...{ activeTab, setActiveTab, searchQuery, setSearchQuery, dateRange, setDateRange }}
        disable={props.setup_status !== 'completed'}
      />

      <Box className="section-body">
        {rows.length > 0 && setup_status === 'completed' && (
          <>
            <Table
              // @ts-ignore
              columns={columns}
              // @ts-ignore
              data={rows}
              onRowClick={() => {}}
            />
            <Pagination
              page={props.page}
              total={meta.count_total}
              pageSize={meta.per_page}
              onNext={onNextPage}
              onPrev={onPrevPage}
              onGoTo={onGoToPage}
            />
          </>
        )}

        {(rows.length === 0 || loading) && (
          <Box width="100%" display="flex" justifyContent="center" height="100%">
            {loading && (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="lg"
                margin="auto"
              />
            )}
            {!loading &&
              setup_status === 'completed' &&
              searchQuery === '' &&
              activeTab === 'all' &&
              !dateRange.to &&
              !dateRange.from && (
                <EmptyState
                  image={noPaymentRequests}
                  paddingY="150px"
                  heading="No transactions yet"
                  subheading="Once transactions occur, they show up here."
                />
              )}

            {!loading &&
              setup_status === 'completed' &&
              (searchQuery !== '' || activeTab !== 'all' || dateRange.to || dateRange.from) && (
                <EmptyState
                  image={noPaymentRequests}
                  paddingY="150px"
                  heading="Looks like you don't have any transactions that match the criteria selected"
                  subheading="Once any match, you'll see them all here"
                />
              )}
          </Box>
        )}
      </Box>
    </>
  );
};
