import { Box, Checkbox, Flex, Icon } from '@chakra-ui/core';
import { Input, Button } from 'app/components';
import { useFormik } from 'formik';
import * as React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  username: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export type LoginFormInitialValuesProps = yup.InferType<typeof validationSchema> & {
  rememberMe?: boolean;
};

export interface LoginFormProps {
  onSubmit: (values: LoginFormInitialValuesProps) => void;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading }: LoginFormProps) {
  const formik = useFormik({
    validationSchema,
    initialValues: { username: '', password: '', rememberMe: true },
    onSubmit: (values: LoginFormInitialValuesProps) => onSubmit(values),
  });

  const [viewPassword, setViewPassword] = React.useState(false);

  const handleToggleViewPassword = () => {
    setViewPassword(!viewPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box mb="2rem">
        <Input
          autoFocus
          type="email"
          id="username"
          name="username"
          label="Email address"
          value={formik.values.username}
          onChange={formik.handleChange}
          errorMessage={formik.errors.username}
          isInvalid={!!formik.touched.username && !!formik.errors.username}
        />
      </Box>
      <Box mb="12px">
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
      <Flex mb="30px" flexWrap="wrap" flexDirection="row" justifyContent="space-between">
        <Link to="/forgot-password" style={{ color: '#2034c5' }} tabIndex={-1}>
          Forgot your password?
        </Link>
      </Flex>

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

      <Flex alignItems="center" justifyContent="space-between">
        <Box>
          <Checkbox
            size="md"
            name="rememberMe"
            variantColor="blue"
            isChecked={formik.values.rememberMe}
            onChange={formik.handleChange}
          >
            Remember Me
          </Checkbox>
        </Box>
      </Flex>
    </form>
  );
}
