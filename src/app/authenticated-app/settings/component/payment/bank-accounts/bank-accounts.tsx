//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Box, IconButton, Text, useClipboard, useToast } from '@chakra-ui/core';
import { BankAccountForm } from './bank-account-form';
import { BankAccountItem } from './bank-account-item';
import { BankAccountDialog } from './bank-account-dialog';
import { ToastBox, Button } from '../../../../../components';
import { useSelector } from 'react-redux';
import { selectBankAccounts } from '../../../slices';
import { selectManagedAccount } from '../../../../payments/selectors';
import { Divider } from '@chakra-ui/core/dist';

export const BankAccounts = ({
  banks,
  getBanks,
  banks_loading,
  bank_account_form_loading,
  resolveBankAccount,
  addBankAccount,
  deleteBankAccount,
}) => {
  const [deleteLoading, setDeleteLoading] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const bank_accounts = useSelector(selectBankAccounts);

  const toast = useToast();

  useEffect(() => {
    if (banks.length === 0 && getBanks) getBanks();
  }, [banks.length, getBanks]);

  useEffect(() => {
    setIsDialogOpen(false);
  }, [bank_accounts]);

  const managed_account = useSelector(selectManagedAccount);

  const handleDeleteBankAccount = async bank_account_id => {
    setDeleteLoading([...deleteLoading, bank_account_id]);
    const res = await deleteBankAccount(bank_account_id);
    let message = 'Beneficiary deleted successfully';
    if (!res) message = 'Unable to delete beneficiary account, please try again';
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
    });
    setDeleteLoading(deleteLoading.filter((i: string) => i !== bank_account_id));
  };

  const { onCopy } = useClipboard(managed_account?.account_number);

  const handleCopyManagedAccountNumber = () => {
    onCopy();
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => (
        <ToastBox
          status="info"
          onClose={onClose}
          message="Account number has been copied to your clipboard"
        />
      ),
    });
  };

  return (
    <>
      <Box>
        {managed_account && (
          <Box className="bank-account-list">
            <Box className="item">
              <Box display="flex" justifyContent="space-between" width="100%">
                <Box width="50%">
                  <Text className="text-primary" textTransform="uppercase">
                    {managed_account.account_name}
                  </Text>
                  <Text className="text-secondary">NGN</Text>
                </Box>

                <Box width="50%">
                  <Text className="text-primary">{managed_account.account_number}</Text>
                  <Text className="text-secondary">{managed_account.bank_name}</Text>
                </Box>
              </Box>

              <IconButton
                aria-label="copy account number"
                icon="copy"
                backgroundColor="white"
                size="sm"
                fontSize="20px"
                marginRight="10px"
                onClick={handleCopyManagedAccountNumber}
              />
            </Box>
          </Box>
        )}

        {bank_accounts.length === 0 && (
          <BankAccountForm
            is_loading={bank_account_form_loading}
            banks={banks}
            banks_loading={banks_loading}
            resolveBankAccount={resolveBankAccount}
            getBanks={getBanks}
            addBankAccount={addBankAccount}
          />
        )}
        {bank_accounts.length > 0 && (
          <>
            <Box
              width="100%"
              display="flex"
              alignItems="center"
              marginTop="20px"
              justifyContent="space-between"
            >
              <Box fontSize="14px" color="#757575" paddingRight="50px">
                Others
              </Box>
              <Divider width="90%" />
            </Box>
            <Box className="bank-account-list">
              {bank_accounts.map(i => (
                <BankAccountItem
                  key={i.id}
                  {...{
                    ...i,
                    handleDeleteBankAccount,
                    isLoading: deleteLoading.includes(i.id),
                  }}
                />
              ))}
            </Box>
            <Box className="bank-account-actions">
              <Button variantColor="blue" onClick={() => setIsDialogOpen(true)}>
                Add Bank Details
              </Button>
            </Box>
          </>
        )}
      </Box>
      <BankAccountDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        bank_account_form_loading={bank_account_form_loading}
        banks={banks}
        banks_loading={banks_loading}
        resolveBankAccount={resolveBankAccount}
        getBanks={getBanks}
        addBankAccount={addBankAccount}
      />
    </>
  );
};
