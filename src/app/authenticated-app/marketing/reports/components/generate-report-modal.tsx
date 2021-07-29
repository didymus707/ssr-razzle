import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text,
} from '@chakra-ui/core';
import * as yup from 'yup';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';
import {
  DatePickerComponent,
  ModalContainer,
  ModalContainerOptions,
  Input,
  Button,
} from 'app/components';
import { MarketingReportSchema } from '../../campaigns/campaigns.types';

type GenerateReportModalProps = {
  initialValues?: Pick<MarketingReportSchema, 'from' | 'recipient' | 'to'>;
  onSubmit: FormikConfig<Pick<MarketingReportSchema, 'from' | 'recipient' | 'to'>>['onSubmit'];
} & ModalContainerOptions;

export const GenerateReportModal = (props: GenerateReportModalProps) => {
  const { isOpen, onClose, onSubmit, initialValues } = props;
  const {
    touched,
    values,
    errors,
    isSubmitting,
    submitForm,
    setFieldValue,
    handleChange,
  } = useFormik({
    onSubmit,
    initialValues: initialValues
      ? initialValues
      : {
          recipient: '',
          to: undefined,
          from: undefined,
        },
    validationSchema: yup.object().shape({
      to: yup.date().required('End date is required'),
      from: yup.date().required('Start date is required'),
      recipient: yup.string().email('Invalid email format').required('Recipient email is required'),
    }),
  });

  return (
    <ModalContainer
      size="sm"
      isOpen={isOpen}
      onClose={onClose}
      title="Generate a Report"
      titleStyleProps={{ pb: '0', fontSize: '1.2rem' }}
    >
      <ModalCloseButton size="sm" />
      <ModalBody pt="0">
        <Text pb="1.5rem" fontSize="0.8rem" color="#4f4f4f">
          When your report is ready, it will be sent to the email provided below.
        </Text>
        <FormLabel fontSize="0.875rem" color="#1a1a1a">
          Date Range
        </FormLabel>
        <Stack
          isInline
          mb="1.5rem"
          spacing={['0', '0', '1rem', '1rem']}
          flexWrap={['wrap', 'wrap', 'unset', 'unset']}
        >
          <Box width={['100%', '100%', '48%', '48%']} mb={['1.5rem', '1.5rem', '0', '0']}>
            <FormControl isInvalid={!!touched.from && !!errors.from}>
              <DatePickerComponent
                size="sm"
                value={values.from}
                onDayChange={date => setFieldValue('from', date)}
                dayPickerProps={{ disabledDays: { after: new Date() } }}
                isInvalid={!!touched.from && !!errors.from}
              />
              <FormErrorMessage>{errors.from}</FormErrorMessage>
            </FormControl>
          </Box>
          <Box width={['100%', '100%', '48%']}>
            <FormControl isInvalid={!!touched.to && !!errors.to}>
              <DatePickerComponent
                size="sm"
                value={values.to}
                onDayChange={date => setFieldValue('to', date)}
                dayPickerProps={{ disabledDays: { after: new Date() } }}
                isInvalid={!!touched.to && !!errors.to}
              />
              <FormErrorMessage>{errors.to}</FormErrorMessage>
            </FormControl>
          </Box>
        </Stack>
        <FormControl mb="1.5rem" isInvalid={!!touched.recipient && !!errors.recipient}>
          <FormLabel fontSize="0.875rem" color="#1a1a1a">
            Recipient's Email
          </FormLabel>
          <Input
            size="sm"
            type="email"
            id="recipient"
            name="recipient"
            value={values.recipient}
            onChange={handleChange}
          />
          <FormErrorMessage>{errors.recipient}</FormErrorMessage>
        </FormControl>
      </ModalBody>
      <Flex
        py="1rem"
        px="1.5rem"
        alignItems="center"
        borderTopWidth="1px"
        justifyContent="space-between"
      >
        <Button size="sm" width="48%" onClick={onClose} variant="outline" variantColor="blue">
          Cancel
        </Button>
        <Button
          size="sm"
          width="48%"
          variantColor="blue"
          onClick={submitForm}
          isLoading={isSubmitting}
        >
          Generate
        </Button>
      </Flex>
    </ModalContainer>
  );
};
