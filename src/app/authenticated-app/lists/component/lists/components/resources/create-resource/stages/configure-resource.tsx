import React, { useEffect, useState } from 'react';
import { Box, Checkbox, IconButton, Tooltip } from '@chakra-ui/core';
import { Button, ToastBox, Input } from 'app/components';
import { resource_types } from '../../../../../../list.data';
import { ResourceType } from '../../../../../../lists.types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Divider, Icon, Image, useToast } from '@chakra-ui/core/dist';
import { useHistory } from 'react-router';
import googleSignInButton from 'app/authenticated-app/lists/assets/btn_google_signin_dark_normal_web@2x.png';

interface Props {
  resourceType: string;
  requestResourceAuth: Function;
  requestAppResourceAuth: Function;
  submitAppResourceAuth: Function;
  testResourceConnection: Function;
  createResource: Function;
}

const initialValues = {
  name: '',
  account_name: '',
  host: '',
  port: '',
  dbname: '',
  username: '',
  password: '',
  ssh: false,
  bastion_host: '',
  bastion_port: '22',
  bastion_user: 'simpu',
};

const DBValidationSchema = yup.object().shape({
  name: yup.string().required('Connection name is required'),
  host: yup.string().required('Host address is required'),
  port: yup.string().required('Database port is required'),
  username: yup.string().required('Database user is required'),
  password: yup.string().required('Database password is required'),
  dbname: yup.string().required('Database name is required'),
});

const AppValidationSchema = yup.object().shape({
  name: yup.string().required('Connection name is required'),
  account_name: yup.string().required('Account name is required'),
});

const APIValidationSchema = yup.object().shape({
  name: yup.string().required('Connection name is required'),
});

const APIPasswordAuthValidationSchema = yup.object().shape({
  name: yup.string().required('Connection name is required'),
  username: yup.string().required('Username name is required'),
  password: yup.string().required('Password name is required'),
});

export const ConfigureResourceType = (props: Props) => {
  const [testConnectionLoading, setTestConnectionLoading] = useState<boolean>(false);
  const [connectionVerified, setConnectionVerified] = useState<boolean>(false);

  const resourceType = resource_types.find((i: ResourceType) => i.key === props.resourceType);

  const toast = useToast();
  const routerHistory = useHistory();

  const testConnection = async () => {
    setTestConnectionLoading(true);
    try {
      const payload = {
        ...values,
        ssh_config: {
          host: values.bastion_host,
          port: values.bastion_port,
          user: values.bastion_user,
        },
      };
      const response_message = await props.testResourceConnection(payload, resourceType?.key);
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="success" message={response_message} />,
      });
      setConnectionVerified(true);
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox status="error" message={e} />,
      });
    }
    setTestConnectionLoading(false);
  };

  const createResource = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        ssh_config: {
          host: values.bastion_host,
          port: values.bastion_port,
          user: values.bastion_user,
        },
      };
      await props.createResource(payload, resourceType?.key);
      toast({
        position: 'bottom-left',
        render: () => (
          <ToastBox
            status="success"
            message={`${resourceType?.label} connection added successfully`}
          />
        ),
      });
      routerHistory.push('/s/lists/connections');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message={e?.message || e} />,
      });
    }
    setSubmitting(false);
  };

  const ip = process.env.NODE_ENV === 'production' ? '159.65.91.153' : '134.209.187.125';
  const handleCopyIP = () => {
    navigator.clipboard.writeText(ip);
    toast({
      position: 'bottom-left',
      render: () => <ToastBox status="success" message="IP address copied to clipboard" />,
    });
  };

  const requestAuth = async () => {
    setSubmitting(true);
    try {
      const auth_url = await props.requestResourceAuth(values.name, resourceType?.key);
      window.location.href = auth_url;
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => (
          <ToastBox message="Unable to connect Google Sheets account, please try again" />
        ),
      });
    }
    setSubmitting(false);
  };

  const requestAppAuth = async () => {
    setSubmitting(true);
    try {
      const authURL = await props.requestAppResourceAuth(resourceType?.key, {
        name: values.name,
        organisation_account_name: values.account_name,
      });
      window.location.href = authURL;
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message="Unable to connect to account, please try again" />,
      });
    }
    setSubmitting(false);
  };

  const submitAppAuth = async () => {
    setSubmitting(true);
    try {
      const { username, password } = values;
      await props.submitAppResourceAuth(
        resourceType?.key,
        {
          username,
          password,
        },
        {
          organisation_account_name: values.name,
        },
      );
      routerHistory.push('/s/lists/connections?connectStatus=success&connectType=Mambu');
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: () => <ToastBox message="Unable to connect to account, please try again" />,
      });
    }
    setSubmitting(false);
  };

  const submit = async () => {
    if (resourceType?.type === 'api') await requestAuth();
    else if (resourceType?.passwordAuth) await submitAppAuth();
    else if (resourceType?.type === 'app') await requestAppAuth();
    else if (resourceType?.type === 'database') await createResource();
  };

  const formik = useFormik({
    validationSchema: resourceType?.passwordAuth
      ? APIPasswordAuthValidationSchema
      : resourceType?.type === 'api'
      ? APIValidationSchema
      : resourceType?.type === 'app'
      ? AppValidationSchema
      : DBValidationSchema,
    initialValues,
    onSubmit: submit,
  });

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleReset,
    touched,
    isSubmitting,
    setSubmitting,
  } = formik;

  useEffect(() => {
    setConnectionVerified(false);
  }, [values]);

  return (
    <Box className="section-resource-config">
      <Box className="section-resource-config-form">
        <Box className="row">
          <Box className="field">
            <Input
              label="Name"
              isInvalid={touched.name && !!errors.name}
              size="sm"
              mb="5px"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              onReset={handleReset}
              errorMessage={errors.name}
              autoFocus
            />
            <Box className="description" mt="10px">
              Your {resourceType?.label} connection needs a unique name. You'll use this name when
              importing data into your Simpu list.
            </Box>
          </Box>
        </Box>

        {['shopify', 'woo-commerce'].includes(resourceType?.key || '') && (
          <Box className="row">
            <Box className="field">
              <Input
                label="Account Name"
                isInvalid={touched.account_name && !!errors.account_name}
                size="sm"
                mb="5px"
                name="account_name"
                value={values.account_name}
                onChange={handleChange}
                onBlur={handleBlur}
                onReset={handleReset}
                errorMessage={errors.account_name}
              />
              <Box className="description" mt="10px">
                This should be the name of your {resourceType?.label} store
              </Box>
            </Box>
          </Box>
        )}

        {resourceType?.passwordAuth && (
          <>
            <Box className="row">
              <Box className="field">
                <Input
                  label="Username"
                  isInvalid={touched.username && !!errors.username}
                  size="sm"
                  mb="5px"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onReset={handleReset}
                  errorMessage={errors.username}
                />
                <Box className="description" mt="10px">
                  This should be the username of your {resourceType?.label} account
                </Box>
              </Box>
            </Box>
            <Box className="row">
              <Box className="field">
                <Input
                  label="Password"
                  isInvalid={touched.password && !!errors.password}
                  size="sm"
                  mb="5px"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onReset={handleReset}
                  errorMessage={errors.password}
                  type="password"
                />
              </Box>
            </Box>
          </>
        )}

        {resourceType?.type === 'database' && (
          <>
            <Divider marginY="35px" />

            <Box className="row">
              <Box className="field">
                <Input
                  label="Host"
                  isInvalid={touched.host && values.host.length === 0}
                  size="sm"
                  mb="5px"
                  name="host"
                  value={values.host}
                  errorMessage={errors.host}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Input
                  label="Port"
                  isInvalid={touched.port && values.port.length === 0}
                  size="sm"
                  mb="5px"
                  name="port"
                  value={values.port}
                  errorMessage={errors.port}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Input
                  label="Database Name"
                  isInvalid={touched.dbname && values.dbname.length === 0}
                  size="sm"
                  mb="5px"
                  name="dbname"
                  value={values.dbname}
                  errorMessage={errors.dbname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Input
                  label="Username"
                  isInvalid={touched.username && values.username.length === 0}
                  size="sm"
                  mb="5px"
                  name="username"
                  value={values.username}
                  errorMessage={errors.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Input
                  label="Password"
                  isInvalid={touched.password && values.password.length === 0}
                  size="sm"
                  mb="5px"
                  name="password"
                  value={values.password}
                  errorMessage={errors.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  type="password"
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Checkbox
                  isChecked={values.ssh}
                  name="ssh"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onReset={handleReset}
                  alignItems="center"
                >
                  <Box fontSize="14px" mt="1px">
                    Enable SSH tunnel
                  </Box>
                </Checkbox>
              </Box>
            </Box>
          </>
        )}

        {resourceType?.type === 'database' && values.ssh && (
          <>
            <Divider marginY="35px" />

            <Box className="row">
              <Box className="field">
                <Input
                  label="Bastion Host"
                  size="sm"
                  mb="10px"
                  name="bastion_host"
                  value={values.bastion_host}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Input
                  label="Bastion Port"
                  size="sm"
                  mb="10px"
                  name="bastion_port"
                  value={values.bastion_port}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="row">
              <Box className="field">
                <Input
                  label="Bastion User"
                  size="sm"
                  mb="10px"
                  name="bastion_user"
                  value={values.bastion_user}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Box>

            <Box className="section-info">
              <Box fontWeight="500">SSH public key authentication</Box>
              <Box
                onClick={() =>
                  window.open(`${process.env.REACT_APP_API_URL}/lists/static/ssh-key`, '_blank')
                }
              >
                <span className="link">Download Simpu's public key here </span>
                and add it to your ~/.ssh/authorized_keys. You may need to create a new user also.
              </Box>
            </Box>
          </>
        )}

        <Box my="0.5rem" fontSize="14px">
          Trouble connecting your data source?{' '}
          <span
            onClick={() => {
              window.location.href = 'mailto:info@simpu.co';
            }}
            color="blue"
            style={{
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            Contact us and we'll help you out.
          </span>
        </Box>

        <Box className="section-actions">
          {resourceType?.type === 'database' && (
            <>
              <Tooltip
                zIndex={10000}
                placement="bottom"
                label="You'll need to test your connection parameters and credentials to make sure
                everything's working fine before you proceed with any other thing 😉"
                aria-label="test-connection"
              >
                <Icon name="info" size="12px" color="#b9b9b9" />
              </Tooltip>
              <Button
                marginX="1rem"
                variant="link"
                size="sm"
                onClick={testConnection}
                isLoading={testConnectionLoading}
                isDisabled={!!Object.keys(errors).length || !Object.keys(touched).length}
              >
                Test Connection
              </Button>

              {connectionVerified && (
                <Icon name="check-circle" color="limegreen" marginRight="20px" />
              )}
            </>
          )}

          {resourceType?.type === 'database' && (
            <Button
              variant="solid"
              variantColor="blue"
              size="sm"
              onClick={formik.handleSubmit}
              isLoading={isSubmitting}
              isDisabled={!!Object.keys(errors).length || !Object.keys(touched).length}
            >
              Connect data source
            </Button>
          )}

          {['api', 'app'].includes(resourceType?.type || '') &&
            resourceType?.key !== 'google-sheets' && (
              <Button
                variant="solid"
                variantColor="blue"
                size="sm"
                onClick={formik.handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!!Object.keys(errors).length || !Object.keys(touched).length}
              >
                Connect to {resourceType?.label}
              </Button>
            )}

          {resourceType?.key === 'google-sheets' && (
            <Box
              cursor={
                !!Object.keys(errors).length || !Object.keys(touched).length
                  ? 'not-allowed'
                  : 'pointer'
              }
              onClick={() => {
                if (Object.keys(errors).length > 0 || !Object.keys(touched).length) return;
                else formik.handleSubmit();
              }}
              opacity={Object.keys(errors).length > 0 || !Object.keys(touched).length ? 0.5 : 1}
            >
              <Image src={googleSignInButton} height="42px" />
            </Box>
          )}
        </Box>
      </Box>
      {resourceType?.type === 'database' && (
        <Box className="section-resource-config-info" mb="2rem">
          <Box className="description">
            Please allow Simpu to connect to your database by white-listing our IP address:
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Box className="ip">{ip}</Box>
            <Tooltip
              aria-label="copy-ip"
              zIndex={10000}
              placement="bottom"
              label="Please copy IP address"
            >
              <IconButton
                variant="link"
                aria-label="copy"
                icon="copy"
                size="xs"
                marginLeft="10px"
                onClick={handleCopyIP}
              />
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};
