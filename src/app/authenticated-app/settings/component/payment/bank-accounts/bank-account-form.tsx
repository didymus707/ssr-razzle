// @ts-nocheck
import { Box, Input, Text, Select, useToast } from '@chakra-ui/core';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as yup from 'yup';
import { ToastBox, Button } from '../../../../../components';

const validation_schema = yup.object().shape({
  account_number: yup.string().required('Account number is required'),
  bank_code: yup.string().required('Bank is required'),
});

const initial_values = {
  account_number: '',
  bank_code: '',
};

export const BankAccountForm = ({ banks, resolveBankAccount, addBankAccount }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState(null);

  const toast = useToast();

  const verify = async values => {
    setLoading(true);
    const response = await resolveBankAccount(values);

    let message = 'Could not resolve account details, please check the provided information';
    if (response) {
      message = 'Account details retrieved successfully';
      setDetails({ ...values, ...response });
    }
    setLoading(false);

    toast({
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
    });
  };

  const submit = async () => {
    setLoading(true);
    const response = await addBankAccount(details);
    let message = 'Unable to add the provided bank details, please try again';
    if (response) message = 'Bank details added successfully';
    setLoading(false);
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
    });
  };

  const numberRegex = new RegExp('^[0-9]+$');

  return (
    <Box width="100%" maxW="400px">
      <Formik
        initialValues={initial_values}
        validationSchema={validation_schema}
        onSubmit={details ? submit : verify}
      >
        {({ values, handleChange, handleBlur, handleSubmit, touched, errors, handleFocus }) => (
          <Box>
            <Box marginBottom="20px">
              <Text fontSize="sm" color="rgba(17, 17, 17, 0.5)">
                Account Number
              </Text>
              <Input
                variant="flushed"
                name="account_number"
                placeholder="Enter Account Number"
                onChange={e => {
                  if (numberRegex.test(e.target.value)) handleChange(e);
                  setDetails(null);
                }}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={values.account_number}
                isInvalid={touched['account_number'] && !!errors['account_number']}
                pattern={numberRegex}
                errorBorderColor="crimson"
              />
            </Box>

            <Box marginBottom="20px">
              <Text fontSize="sm" color="rgba(17, 17, 17, 0.5)">
                Bank
              </Text>
              <Select
                variant="flushed"
                name="bank_code"
                placeholder="Select Bank"
                onChange={e => {
                  handleChange(e);
                  setDetails(null);
                }}
                onBlur={handleBlur}
                value={values.bank_code}
              >
                {banks.map(i => (
                  <option key={i.id} value={i.code}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </Box>

            {details && (
              <Box marginBottom="20px">
                <Text fontSize="sm" color="rgba(17, 17, 17, 0.5)">
                  Account Name
                </Text>
                <Input
                  variant="flushed"
                  name="account_name"
                  value={details.account_name}
                  isDisabled
                />
              </Box>
            )}

            <Button isFullWidth variantColor="blue" isLoading={loading} onClick={handleSubmit}>
              {details ? 'Add Account' : 'Verify'}
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};
