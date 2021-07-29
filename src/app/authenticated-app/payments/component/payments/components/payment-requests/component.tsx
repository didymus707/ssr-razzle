import React, { useEffect, useState } from 'react';
import { Box, Spinner, useToast } from '@chakra-ui/core/dist';
import { PaymentRequest, PaymentSetupStatus } from '../../../../payments.types';
import { useSelector } from 'react-redux';
import { selectPaymentSetupStatus } from '../../../../selectors';
import { PaymentRequestToolbar } from './toolbar';
import { Table } from '../components/table';
import { EmptyState, Pagination, ToastBox } from '../../../../../../components';
import noPaymentRequests from '../../../../assets/no-payment-requests.svg';
import { PaymentRequestTableColumns } from './table-columns';
import { useHistory } from 'react-router-dom';

export const PaymentRequestsComponent = (props: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'paid' | 'pending' | 'expired' | 'cancelled'>(
    'all',
  );
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
    on: null,
  });
  const [page, setPage] = useState<number>(1);

  const onNextPage = () => setPage(page + 1);
  const onPrevPage = () => setPage(page - 1);
  const onGoToPage = (i: number) => setPage(i);

  const toast = useToast();

  const router_history = useHistory();

  const {
    payment_requests,
    fetchPaymentRequests,
    cancelPaymentRequest,
    markPaymentRequestPaid,
  } = props;

  const copy_request_link = (request: PaymentRequest) => {
    const request_link = `https://paylink${
      process.env.NODE_ENV === 'development' ? '.demo' : ''
    }.simpu.co/?code=${request.code}`;
    navigator.clipboard.writeText(request_link);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox status="success" onClose={onClose} message="Request link copied" />
      ),
    });
  };

  const view_request_conversation = (conversation_id: string) => {
    router_history.push(`/s/inbox/${conversation_id}`);
  };

  const columns = React.useMemo(
    () =>
      PaymentRequestTableColumns({
        copy_request_link,
        cancel_request: cancelPaymentRequest,
        mark_request_paid: markPaymentRequestPaid,
        view_request_conversation,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // @ts-ignore
  const setup_status: PaymentSetupStatus = useSelector(selectPaymentSetupStatus);

  useEffect(() => {
    if (setup_status === 'completed') fetchPaymentRequests(page, activeTab, searchQuery, dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeTab, searchQuery, dateRange]);

  const rows: PaymentRequest[] = payment_requests.by_id.map(
    (id: string) => payment_requests.data[id],
  );
  // @ts-ignore
  const { meta, loading } = payment_requests;

  return (
    <>
      <Box className="section-title">
        <Box className="title">Payment Requests</Box>
      </Box>
      <PaymentRequestToolbar
        {...{ activeTab, setActiveTab, searchQuery, setSearchQuery, dateRange, setDateRange, onGoToPage }}
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
              page={page}
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
                  heading="Looks like you don't have any payment requests that match the criteria selected"
                  subheading="Once any match, you'll see them all here"
                />
              )}
          </Box>
        )}
      </Box>
    </>
  );
};
