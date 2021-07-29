import { Box, FormControl, FormErrorMessage, FormLabel, Grid, Input } from '@chakra-ui/core';
import { Button } from 'app/components';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
});

type ProfileFormInitialValues = yup.InferType<typeof validationSchema> & {
  email?: string;
};

type ProfileFormProps = {
  isLoading?: boolean;
  initialValues?: any;
  onSubmit: (values: ProfileFormInitialValues) => void;
};

export function ProfileForm({ onSubmit, isLoading, initialValues }: ProfileFormProps) {
  const formik = useFormik({
    validationSchema,
    initialValues: initialValues || {
      last_name: '',
      first_name: '',
    },
    onSubmit: (values: ProfileFormInitialValues) => onSubmit(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid mb="0.5rem" gap="1rem" gridTemplateColumns={['auto', 'auto', 'auto auto', 'auto auto']}>
        <Box marginBottom="0.875rem">
          <FormControl isInvalid={!!formik.touched.first_name && !!formik.errors.first_name}>
            <FormLabel color="#757575" fontSize="0.875rem">
              First name
            </FormLabel>
            <Input
              size="md"
              variant="flushed"
              type="text"
              id="first_name"
              name="first_name"
              placeholder="Enter first name"
              onChange={formik.handleChange}
              value={formik.values.first_name}
            />
            <FormErrorMessage marginBottom="0.625rem">{formik.errors.first_name}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box marginBottom="0.875rem">
          <FormControl isInvalid={!!formik.touched.last_name && !!formik.errors.last_name}>
            <FormLabel color="#757575" fontSize="0.875rem">
              Last name
            </FormLabel>
            <Input
              size="md"
              variant="flushed"
              type="text"
              id="last_name"
              name="last_name"
              placeholder="Enter last name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
            />
            <FormErrorMessage marginBottom="0.625rem">{formik.errors.last_name}</FormErrorMessage>
          </FormControl>
        </Box>
        <Box marginBottom="0.875rem">
          <FormControl isInvalid={!!formik.touched.email && !!formik.errors.email}>
            <FormLabel color="#757575" fontSize="0.875rem">
              Email address
            </FormLabel>
            <Input
              size="md"
              variant="flushed"
              name="email"
              id="email"
              type="text"
              isDisabled
              placeholder="Enter email address"
              value={formik.values.email?.toLowerCase()}
              onChange={formik.handleChange}
            />
            <FormErrorMessage marginBottom="0.625rem">{formik.errors.email}</FormErrorMessage>
          </FormControl>
        </Box>
      </Grid>
      <Button size="md" type="submit" variantColor="blue" isLoading={isLoading}>
        Update
      </Button>
    </form>
  );
}
