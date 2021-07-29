import React, { useEffect } from 'react';
import { Box, useDisclosure } from '@chakra-ui/core/dist';
import { PaymentSetupStatus } from '../../../../payments.types';
import { useSelector } from 'react-redux';
import { selectPaymentSetupStatus } from '../../../../selectors';
import { formatToCurrency } from '../../../../../inbox/inbox.utils';
import { TransferFundsDialog } from '../components/funds-transfer-dialog';
import { Button } from 'app/components';

export const AccountBalanceComponent = (props: any) => {
  const {
    managed_account: {
      account: { data: managed_account },
    },
    bank_accounts: { banks },
    fetchBanks,
  } = props;

  // @ts-ignore
  const setup_status: PaymentSetupStatus = useSelector(selectPaymentSetupStatus);

  useEffect(() => {
    // @ts-ignore
    props.fetchManagedAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    isOpen: isTransferFundsDialogOpen,
    onClose: closeTransferFundsDialog,
    onOpen: openTransferFundsDialog,
  } = useDisclosure();

  useEffect(() => {
    if (banks.length === 0) fetchBanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TransferFundsDialog
        isOpen={isTransferFundsDialogOpen}
        onClose={closeTransferFundsDialog}
        managed_account={managed_account}
        banks={banks}
      />
      <Box className="section-title">
        <Box className="title">Account Balance</Box>
      </Box>

      {setup_status === 'completed' && (
        <Box className="section-body" alignItems="flex-start" maxWidth="500px">
          <Box
            display="flex"
            flexDirection="column"
            marginBottom="35px"
            borderRadius="10px"
            padding="30px 20px"
            justifyContent="center"
            alignItems="center"
            backgroundColor="rgba(61, 80, 223, 0.03)"
            border="1px dashed rgba(61, 80, 223, 1)"
          >
            <Box color="#333333" fontWeight="500">
              {managed_account?.account_number}
            </Box>
            <Box color="#3525E6" fontWeight="600" marginTop="5px">
              {managed_account?.bank_name}
            </Box>
            <Box color="#3525E6" fontSize="14px">
              {managed_account?.account_name}
            </Box>

            <Box color="#757575" fontSize="14px" marginTop="10px" textAlign="center">
              Here is your bank account. You can top up your balance by making a transfer into this
              account
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="flex-start">
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Box fontWeight="600" fontSize="24px">
                ₦ {formatToCurrency(managed_account?.balance)}
              </Box>

              <Button
                size="sm"
                variant="solid"
                variantColor="blue"
                onClick={openTransferFundsDialog}
              >
                New Transfer
              </Button>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              marginTop="35px"
              width="500px"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                marginY="5px"
              >
                <Box width="200px" color="#757575">
                  Balance
                </Box>
                <Box width="200px" textAlign="right" fontWeight="500">
                  ₦ {formatToCurrency(managed_account?.balance)}
                </Box>
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                marginY="10px"
              >
                <Box width="200px" color="#757575">
                  Pending payouts
                </Box>
                <Box width="200px" textAlign="right" fontWeight="500">
                  ₦ 0.00
                </Box>
              </Box>

              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                marginY="10px"
              >
                <Box width="200px" color="#757575">
                  Estimated future payouts
                </Box>
                <Box width="200px" textAlign="right" fontWeight="500">
                  ₦ 0.00
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
