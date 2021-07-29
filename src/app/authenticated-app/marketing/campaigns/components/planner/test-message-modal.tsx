import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  ModalCloseButton,
  Text,
} from '@chakra-ui/core';
import { Button, Input, ModalContainer, ModalContainerOptions } from 'app/components';
import * as yup from 'yup';
import { FormikHelpers, useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import { CreditTopupCard } from '../credit-topup-card';
import { numberWithCommas } from '../../../../../../utils';

type TestMessageModalProps = {
  isLoading?: boolean;
  credit_balance: number;
  onSubmit: (
    values: { recipients: string },
    formikHelpers: FormikHelpers<{ recipients: string }>,
  ) => void | Promise<any>;
} & ModalContainerOptions;

export const TestMessageModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  credit_balance,
}: TestMessageModalProps) => {
  const validationSchema = yup.object().shape({
    recipients: yup.string().required('Phone numbers are required'),
  });
  const { values, touched, errors, handleChange, setFieldValue, handleSubmit } = useFormik({
    validationSchema,
    initialValues: { recipients: '' },
    onSubmit: (values, helpers) => onSubmit(values, helpers),
  });

  const recipientsLength = values.recipients.split(',').length;

  const handleClose = () => {
    setFieldValue('recipients', '');
    onClose && onClose();
  };

  const amountToPay = (recipientsLength ?? 0) * 3.65;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <ModalContainer
      size="sm"
      isOpen={isOpen}
      onClose={handleClose}
      title="Send a test message"
      titleStyleProps={{ fontSize: '1rem' }}
    >
      <ModalCloseButton size="sm" />
      <Box px="1.5rem">
        <FormControl isInvalid={!!touched.recipients && !!errors.recipients}>
          <FormLabel pb="0" fontSize="0.8rem">
            Test message recipients
          </FormLabel>
          <Text pb="0.5rem" color="gray.600" fontSize="0.7rem">
            Enter 10-digit phone numbers with country code, in a comma separated list.
          </Text>
          <Input
            size="sm"
            type="text"
            ref={inputRef}
            name="recipients"
            value={values.recipients}
            onChange={handleChange}
            placeholder="Phone numbers e.g 2348078657980,2348078657909"
          />
          <FormErrorMessage>{errors.recipients}</FormErrorMessage>
        </FormControl>
      </Box>
      {credit_balance / 100 < amountToPay && (
        <Box px="1.5rem" pt="1rem">
          <CreditTopupCard
            amount={amountToPay}
            content={`We'll only be sending approximately ${numberWithCommas(
              Math.floor(credit_balance / (3.65 * 100)),
            )} SMSs as you are low on campaign credits for the number of recipients (${numberWithCommas(
              recipientsLength,
            )}) for this campaign. Please top-up to ensure all recipients receive this campaign.`}
          />
        </Box>
      )}
      <Flex
        py="1rem"
        mt="1.5rem"
        px="1.5rem"
        alignItems="center"
        borderTopWidth="1px"
        justifyContent="space-between"
      >
        <Button size="sm" width="48%" variant="outline" variantColor="blue" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          width="48%"
          variantColor="blue"
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Send test
        </Button>
      </Flex>
    </ModalContainer>
  );
};
