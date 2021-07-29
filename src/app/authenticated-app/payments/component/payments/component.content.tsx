// @ts-nocheck
import React, { useState } from 'react';
import { Box, useDisclosure, useToast } from '@chakra-ui/core';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Button, EmptyState, ToastBox } from '../../../../components';
import { CompletePaymentSetupDialog } from './components/components/finish-setup-dialog';
import blankSetup from '../../assets/blank-setup.svg';
import pendingSetup from '../../assets/pending-setup.svg';
import submittedSetup from '../../assets/submitted-setup.svg';
import { PaymentRequests, TransactionHistory, AccountBalance } from './components';
import { PaymentSetupStatus } from '../../payments.types';
import { useSelector } from 'react-redux';
import { selectPaymentSetupStatus } from '../../selectors';

interface Props {
  match: any;
  requestCreateManagedAccount: Function;
  validateCreateManagedAccount: Function;
}

export const PaymentsContent = (props: Props) => {
  const [BAMVerifyData, setBAMVerifyData] = useState({
    transaction_ref: null,
    prompt: null,
  });
  const [requestBAMLoading, setRequestBAMLoading] = useState(false);
  const [verifyBAMLoading, setVerifyBAMLoading] = useState(false);

  const { match } = props;

  const toast = useToast();

  const setup_status: PaymentSetupStatus = useSelector(selectPaymentSetupStatus);

  const handleFinishSetup = async () => {
    setRequestBAMLoading(true);
    const res = await props.requestCreateManagedAccount();

    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            onClose={onClose}
            message="Unable to request account provisioning, please try again"
          />
        ),
      });
    } else {
      setBAMVerifyData(res);
      openCompleteDialog();
    }
    setRequestBAMLoading(false);
  };

  const handleVerifyBAM = async otp => {
    setVerifyBAMLoading(true);
    const res = await props.validateCreateManagedAccount(BAMVerifyData['transaction_ref'], otp);
    if (!res) {
      setVerifyBAMLoading(false);
      return false;
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Payment setup completed, and account provisioned successfully"
          />
        ),
      });
      setVerifyBAMLoading(false);
      closeCompleteDialog();
      return res;
    }
  };

  const {
    isOpen: completeDialogOpen,
    onClose: closeCompleteDialog,
    onOpen: openCompleteDialog,
  } = useDisclosure();

  return (
    <>
      <CompletePaymentSetupDialog
        isOpen={completeDialogOpen}
        onClose={closeCompleteDialog}
        verify={handleVerifyBAM}
        prompt={BAMVerifyData['prompt']}
        isLoading={verifyBAMLoading}
      />
      <Box className="content">
        <Switch>
          <Route path={`${match.path}/balance`} render={() => <AccountBalance />} />
          <Route path={`${match.path}/requests`} render={() => <PaymentRequests />} />
          <Route path={`${match.path}/history`} render={() => <TransactionHistory />} />
          <Route path="*">
            <Redirect to={`${match.path}/requests`} />
          </Route>
        </Switch>

        {setup_status !== 'completed' && (
          <>
            {setup_status === 'pristine' && (
              <EmptyState
                image={blankSetup}
                paddingY="150px"
                heading="Setup your account to receive payments"
                subheading={
                  'Get a unique bank account for all your transactions. Click the button below to setup your account.'
                }
                subheadingProps={{
                  width: '500px',
                }}
                children={
                  <Button
                    size="sm"
                    variantColor="blue"
                    onClick={() => window.open('/s/payments/onboarding')}
                  >
                    Setup Account
                  </Button>
                }
              />
            )}
            {setup_status === 'pending' && (
              <EmptyState
                image={pendingSetup}
                paddingY="150px"
                heading="Complete your account setup"
                subheading="You are almost there. Please complete setup to get a Simpu bank account."
                children={
                  <Button
                    variantColor="green"
                    size="sm"
                    onClick={() => window.open('/s/payments/onboarding')}
                  >
                    Complete your setup
                  </Button>
                }
              />
            )}
            {setup_status === 'submitted' && (
              <EmptyState
                image={submittedSetup}
                paddingY="150px"
                heading="Setup pending approval!"
                subheading="Approval usually takes one business day. Once you have been approved, you will be able to receive payments and track transactions. Please check back."
                subheadingProps={{
                  width: '500px',
                }}
                children={
                  <Button
                    size="sm"
                    variant="outline"
                    variantColor="blue"
                    onClick={() => window.open('/s/payments/onboarding')}
                  >
                    Update Setup
                  </Button>
                }
              />
            )}
            {setup_status === 'approved' && (
              <EmptyState
                image={blankSetup}
                paddingY="150px"
                heading="Your setup has been approved!"
                subheading="You'll just need to do a quick account confirmation, after which you'll get your SimpuPay account and all payment features would be available to you"
                subheadingProps={{
                  width: '500px',
                }}
                children={
                  <Button
                    size="sm"
                    variantColor="blue"
                    onClick={handleFinishSetup}
                    isLoading={requestBAMLoading}
                    // @ts-ignore
                    subheadingProps={{
                      width: '500px',
                    }}
                  >
                    Finish Setup
                  </Button>
                }
              />
            )}
          </>
        )}
      </Box>
    </>
  );
};
