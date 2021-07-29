// @ts-nocheck
import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, Text } from '@chakra-ui/core';
import { DialogWrapper } from '../index.styles';
import { BankAccountForm } from './bank-account-form';

export const BankAccountDialog = ({
  isOpen,
  onClose,
  banks,
  getBanks,
  banks_loading,
  bank_account_form_loading,
  resolveBankAccount,
  addBankAccount,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent fontSize="20px">
      <ModalBody>
        <DialogWrapper>
          <Text className="heading">Add Bank Account</Text>
          <BankAccountForm
            is_loading={bank_account_form_loading}
            banks={banks}
            banks_loading={banks_loading}
            resolveBankAccount={resolveBankAccount}
            getBanks={getBanks}
            addBankAccount={addBankAccount}
          />
        </DialogWrapper>
      </ModalBody>
    </ModalContent>
  </Modal>
);
