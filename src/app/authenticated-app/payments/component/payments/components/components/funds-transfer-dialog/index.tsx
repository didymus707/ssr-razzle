import React, { useEffect, useState } from 'react';
import {
  Box,
  Input,
  Modal,
  ModalCloseButton,
  ModalOverlay,
  Select,
  useToast,
} from '@chakra-ui/core/dist';
import { FundsTransferDialogWrapper as Wrapper } from './index.styles';
import { RootState } from '../../../../../../../../root';
import { connect } from 'react-redux';
import { resolveBankAccount, transferFunds } from '../../../../../thunks';
import { Button, ToastBox } from 'app/components';
import { formatToCurrency } from '../../../../../../inbox/inbox.utils';

interface Props {
  banks: any[];
  isOpen: boolean;
  onClose: () => void;
  proceed: Function;
  resolveBankAccount: Function;
  transferFunds: Function;
  managed_account: any;
}

const Component = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [account_number, setAccountNumber] = useState('');
  const [accountBank, setAccountBank] = useState<string | null>('801');
  const [account_name, setAccountName] = useState('');
  const [accountVerified, setAccountVerified] = useState(false);
  const [amount, setAmount] = useState<number>(10000);
  // const [stage, setStage] = useState<'verify' | 'confirm'>('verify');

  const { isOpen, onClose, banks } = props;

  const { resolveBankAccount, transferFunds, managed_account } = props;

  const toast = useToast();
  const regexp = /^[0-9\b]+$/;

  const handleVerify = async () => {
    setLoading(true);
    const res = await resolveBankAccount({
      account_number: account_number,
      bank_code: accountBank,
    });

    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Incorrect bank details provided" />
        ),
      });
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Bank account verified successfully"
          />
        ),
      });
      setAccountName(res['account_name']);
      setAccountVerified(true);
    }

    setLoading(false);
  };

  const handleTransfer = async () => {
    setLoading(true);
    const res = await transferFunds({
      account_number: account_number,
      bank_code: accountBank,
      bank_name: banks.find((i: any) => i.code === accountBank)?.['name'],
      amount,
      save_beneficiary: true,
    });

    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to complete transfer, please try again" />
        ),
      });
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message="Account transfer completed successfully"
          />
        ),
      });
      onClose();
    }
    setLoading(false);
  };

  useEffect(() => {
    setAccountNumber('');
    setAccountName('');
    setAccountBank('801');
    setAccountVerified(false);
    // setStage('verify');
    setAmount(10000);
  }, [isOpen]);

  useEffect(() => {
    setAccountVerified(false);
  }, [account_number, accountBank]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton size="sm" />

      <Wrapper>
        <Box className="heading">Transfer to Account</Box>
        <Box display="flex" flexDirection="column" marginY="20px">
          <Box marginBottom="10px">
            <Box fontSize="14px" color="#757575" marginBottom="5px">
              Account Number
            </Box>
            <Input
              value={account_number}
              onChange={(e: any) => {
                const updatedValue = e.target.value;
                if (regexp.test(updatedValue)) {
                  setAccountNumber(updatedValue);
                }
              }}
            />
          </Box>
          <Box marginBottom="10px">
            <Box fontSize="14px" color="#757575" marginBottom="5px">
              Bank Name
            </Box>
            <Select onChange={(e: any) => setAccountBank(e.target.value)}>
              {banks.map((i: any, index) => (
                <option key={index} value={i.code}>
                  {i.name}
                </option>
              ))}
            </Select>
          </Box>
          {accountVerified && (
            <>
              <Box marginBottom="10px">
                <Box fontSize="14px" color="#757575" marginBottom="5px">
                  Account Name
                </Box>
                <Input value={account_name} isDisabled />
              </Box>
              <Box>
                <Box fontSize="14px" color="#757575" marginBottom="5px">
                  Transfer Amount (₦) maximum of ₦ {formatToCurrency(managed_account?.balance)}
                </Box>
                <Input
                  errorBorderColor="red.300"
                  isInvalid={amount < 10000 || amount > managed_account?.balance - 10000}
                  type="number"
                  min={100}
                  value={amount / 100}
                  onChange={(e: any) => {
                    const updatedValue = e.target.value;
                    if (regexp.test(updatedValue)) {
                      setAmount(updatedValue * 100);
                    }
                  }}
                />
              </Box>
            </>
          )}
        </Box>

        <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
          {!accountVerified && (
            <Button variantColor="blue" size="sm" onClick={handleVerify} isLoading={loading}>
              Verify Account
            </Button>
          )}

          {accountVerified && (
            <Button
              size="sm"
              variantColor="blue"
              isLoading={loading}
              onClick={handleTransfer}
              isDisabled={amount < 10000 || amount > managed_account?.balance - 10000}
            >
              Complete Transfer
            </Button>
          )}
        </Box>
      </Wrapper>
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => ({});

const stateConnector = connect(mapStateToProps, {
  resolveBankAccount,
  transferFunds,
});

const Container = (props: any) => {
  return <Component {...props} />;
};

export const TransferFundsDialog = stateConnector(Container);
