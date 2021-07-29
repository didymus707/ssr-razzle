import { Box, FormControl, FormErrorMessage, FormLabel, Grid, Input } from '@chakra-ui/core';
import { Button } from 'app/components';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  old_password: yup.string().required('Old password is required'),
  new_password: yup.string().required('New password is required'),
});

export type ChangePassordFormInitialValues = yup.InferType<typeof validationSchema>;

export type ChangePassordFormProps = {
  isLoading?: boolean;
  onSubmit: (values: ChangePassordFormInitialValues, callback: () => void) => void;
};

export function ChangePassordForm({ onSubmit, isLoading }: ChangePassordFormProps) {
  const formik = useFormik({
    validationSchema,
    initialValues: {
      old_password: '',
      new_password: '',
    },
    onSubmit: (values: ChangePassordFormInitialValues, { resetForm }) =>
      onSubmit(values, resetForm),
  });

  const isDisabled = () => {
    const { old_password, new_password } = formik.values;
    return !old_password || !new_password;
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid gap="1rem" mb="0.5rem" gridTemplateColumns={['auto', 'auto', 'auto auto', 'auto auto']}>
        <Box marginBottom="0.875rem">
          <FormControl isInvalid={!!formik.touched.old_password && !!formik.errors.old_password}>
            <FormLabel color="#757575" fontSize="0.875rem">
              Old password
            </FormLabel>
            <Input
              size="md"
              variant="flushed"
              type="password"
              id="old_password"
              name="old_password"
              placeholder="Enter old password"
              value={formik.values.old_password}
              onChange={formik.handleChange}
            />
            <FormErrorMessage marginBottom="0.625rem">
              {formik.errors.old_password}
            </FormErrorMessage>
          </FormControl>
        </Box>
        <Box marginBottom="0.875rem">
          <FormControl isInvalid={!!formik.touched.new_password && !!formik.errors.new_password}>
            <FormLabel color="#757575" fontSize="0.875rem">
              New password
            </FormLabel>
            <Input
              size="md"
              variant="flushed"
              type="password"
              id="new_password"
              name="new_password"
              placeholder="Enter new password"
              value={formik.values.new_password}
              onChange={formik.handleChange}
            />
            <FormErrorMessage marginBottom="0.625rem">
              {formik.errors.new_password}
            </FormErrorMessage>
          </FormControl>
        </Box>
      </Grid>
      <Button
        size="md"
        type="submit"
        variantColor="blue"
        isLoading={isLoading}
        isDisabled={isDisabled()}
      >
        Change Password
      </Button>
    </form>
  );
}
