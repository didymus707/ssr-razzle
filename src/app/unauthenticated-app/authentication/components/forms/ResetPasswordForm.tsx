import { Box, Text } from '@chakra-ui/core';
import { Button, Input } from 'app/components';
import { useFormik } from 'formik';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  newPassword: yup.string().required('New password is required'),
  confirmPassword: yup
    .string()
    .required('Password confirmation is required')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

export type ResetPasswordFormInitialValuesProps = yup.InferType<typeof validationSchema>;

export interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormInitialValuesProps) => void;
  isLoading?: boolean;
}

export function ResetPasswordForm({ onSubmit, isLoading }: ResetPasswordFormProps) {
  const formik = useFormik({
    validationSchema,
    initialValues: { newPassword: '', confirmPassword: '' },
    onSubmit: (values: ResetPasswordFormInitialValuesProps) => onSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box mb="2rem">
        <Input
          id="newPassword"
          type="password"
          name="newPassword"
          label="New password"
          onChange={formik.handleChange}
          value={formik.values.newPassword}
          errorMessage={formik.errors.newPassword}
          isInvalid={!!formik.errors.newPassword && !!formik.touched.newPassword}
        />
      </Box>
      <Box mb="2rem">
        <Input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          errorMessage={formik.errors.confirmPassword}
          isInvalid={!!formik.errors.confirmPassword && !!formik.errors.confirmPassword}
        />
      </Box>
      <Button mb="2rem" width="100%" type="submit" variantColor="blue" isLoading={isLoading}>
        Reset your password
      </Button>

      <Box textAlign="center">
        <Text>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#2034c5' }}>
            Log in here
          </Link>
        </Text>
      </Box>
    </form>
  );
}
