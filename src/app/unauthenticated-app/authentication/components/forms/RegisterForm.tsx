import { Box, Checkbox, Icon, Link as ChakraLink, Stack } from '@chakra-ui/core';
import { Input, Button } from 'app/components';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  organisation_name: yup.string().when('showOrganizationName', {
    is: value => value === true,
    otherwise: yup.string(),
    then: yup.string().required('Organisation name is required'),
  }),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
  email: yup.string().email('Invalid email format').required('Email name is required'),
  agreeToTerms: yup.bool().required('Please agree to terms'),
});

export type RegisterFormInitialValuesProps = yup.InferType<typeof validationSchema> & {
  team_id?: string;
  inviteToken?: string;
  link?: string;
  showOrganizationName?: boolean;
};

export interface RegisterFormProps {
  isLoading?: boolean;
  showOrganizationName?: boolean;
  onSubmit: (values: RegisterFormInitialValuesProps) => void;
}

export function RegisterForm({
  onSubmit,
  isLoading,
  showOrganizationName = true,
}: RegisterFormProps) {
  const formik = useFormik({
    validationSchema,
    initialValues: {
      email: '',
      password: '',
      last_name: '',
      first_name: '',
      agreeToTerms: false,
      organisation_name: '',
      showOrganizationName,
    },
    onSubmit: (values: RegisterFormInitialValuesProps) => onSubmit(values),
  });

  const [viewPassword, setViewPassword] = React.useState(false);

  const handleToggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack
        mb="2rem"
        isInline
        spacing={['0', '0', '24px', '24px']}
        flexWrap={['wrap', 'wrap', 'unset', 'unset']}
      >
        <Box width={['100%', '100%', '48%', '48%']} mb={['24px', '24px', '0', '0']}>
          <Input
            autoFocus
            type="text"
            id="first_name"
            name="first_name"
            label="First name"
            onChange={formik.handleChange}
            value={formik.values.first_name}
            errorMessage={formik.errors.first_name}
            isInvalid={!!formik.touched.first_name && !!formik.errors.first_name}
          />
        </Box>
        <Box width={['100%', '100%', '48%']}>
          <Input
            type="text"
            id="last_name"
            name="last_name"
            label="Last name"
            onChange={formik.handleChange}
            value={formik.values.last_name}
            errorMessage={formik.errors.last_name}
            isInvalid={!!formik.touched.last_name && !!formik.errors.last_name}
          />
        </Box>
      </Stack>
      {showOrganizationName && (
        <Box mb="2rem">
          <Input
            type="text"
            id="organisation_name"
            name="organisation_name"
            label="Organisation name"
            onChange={formik.handleChange}
            value={formik.values.organisation_name}
            errorMessage={formik.errors.organisation_name}
            isInvalid={!!formik.touched.organisation_name && !!formik.errors.organisation_name}
          />
        </Box>
      )}
      <Box mb="2rem">
        <Input
          id="email"
          type="email"
          name="email"
          label="Email address"
          value={formik.values.email}
          onChange={formik.handleChange}
          errorMessage={formik.errors.email}
          isInvalid={!!formik.touched.email && !!formik.errors.email}
        />
      </Box>
      <Box mb="2rem">
        <Input
          id="password"
          name="password"
          label="Password"
          onChange={formik.handleChange}
          value={formik.values.password}
          errorMessage={formik.errors.password}
          type={viewPassword ? 'text' : 'password'}
          rightIcon={
            <Icon
              onClick={handleToggleViewPassword}
              name={viewPassword ? 'view' : 'view-off'}
              color="blue.500"
            />
          }
          isInvalid={!!formik.touched.password && !!formik.errors.password}
        />
      </Box>
      <Box mb="2rem">
        <Checkbox
          size="md"
          name="agreeToTerms"
          variantColor="blue"
          onChange={formik.handleChange}
          isChecked={formik.values.agreeToTerms}
        >
          I agree to Simpu's{' '}
          <ChakraLink href="/terms-conditions" isExternal color="blue.500" tabIndex={-1}>
            Terms & Privacy Policy
          </ChakraLink>
        </Checkbox>
      </Box>
      <Button
        width="100%"
        height="50px"
        type="submit"
        variantColor="blue"
        background="#3d50df"
        fontSize="18px"
        fontWeight="normal"
        isDisabled={!formik.values.agreeToTerms}
        isLoading={isLoading}
      >
        Sign up
      </Button>
    </form>
  );
}
