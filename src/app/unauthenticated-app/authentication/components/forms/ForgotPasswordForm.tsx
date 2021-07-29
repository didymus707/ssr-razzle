import { Box } from '@chakra-ui/core';
import { Button, Input } from 'app/components';
import { useFormik } from 'formik';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

export type ForgotPasswordInitialValuesProps = yup.InferType<typeof validationSchema>;

export interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordInitialValuesProps) => void;
  isLoading?: boolean;
}

export function ForgotPasswordForm({ onSubmit, isLoading }: ForgotPasswordFormProps) {
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: (values: ForgotPasswordInitialValuesProps) => onSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box mb="40px">
        <Input
          id="email"
          autoFocus
          type="email"
          name="email"
          label="Email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          errorMessage={formik.errors.email}
          placeholder="Enter your email address"
          isInvalid={!!(formik.errors.email && formik.errors.email)}
        />
      </Box>
      <Button
        mb="30px"
        width="100%"
        height="50px"
        type="submit"
        variantColor="blue"
        background="#3d50df"
        fontSize="18px"
        fontWeight="normal"
        isLoading={isLoading}
      >
        Continue
      </Button>
      <Box textAlign="center">
        <Link to="/login" style={{ color: '#2034c5' }}>
          Back to login
        </Link>
      </Box>
    </form>
  );
}
