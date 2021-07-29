import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalCloseButton,
  Text,
} from '@chakra-ui/core';
import { FormikConfig, useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { ModalContainer, ModalContainerOptions, Button } from 'app/components';

type CampaignLinkModalProps = {
  goBack?(): void;
  isLoading?: boolean;
  initialValues?: any;
  onSubmit: FormikConfig<any>['onSubmit'];
} & ModalContainerOptions;

export const CampaignLinkModal = ({
  goBack,
  isOpen,
  onClose,
  isLoading,
  onSubmit,
  initialValues,
}: CampaignLinkModalProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const validationSchema = yup.object().shape({
    link: yup.string().required('Campaign link is required'),
  });
  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    onSubmit,
    initialValues,
    validationSchema,
  });

  const handleGoBack = () => {
    goBack?.();
    onClose?.();
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <ModalContainer
      size="sm"
      isOpen={isOpen}
      onClose={handleGoBack}
      title="Add a short link"
      initialFocusRef={inputRef}
      titleStyleProps={{ fontSize: '1rem' }}
    >
      <ModalCloseButton size="sm" />
      <Box px="1.5rem">
        <FormControl mb="24px" isInvalid={!!touched.link && !!errors.link}>
          <FormLabel pb="0" fontSize="0.8rem">
            Original URL
          </FormLabel>
          <Text pb="0.5rem" color="gray.600" fontSize="0.7rem">
            Links must be prepended with http:// or https://
          </Text>
          <Input
            size="sm"
            name="link"
            ref={inputRef}
            value={values.link}
            onChange={handleChange}
            placeholder="https://www.google.com"
          />
          <FormErrorMessage>{errors.link}</FormErrorMessage>
        </FormControl>
      </Box>
      <Flex
        py="1rem"
        mt="1.5rem"
        px="1.5rem"
        alignItems="center"
        borderTopWidth="1px"
        justifyContent="space-between"
      >
        <Button size="sm" width="48%" variant="outline" variantColor="blue" onClick={handleGoBack}>
          Cancel
        </Button>
        <Button
          size="sm"
          width="48%"
          variantColor="blue"
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Shorten & insert URL
        </Button>
      </Flex>
    </ModalContainer>
  );
};
