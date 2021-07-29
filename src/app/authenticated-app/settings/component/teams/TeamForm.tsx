import { Box, FormControl, FormErrorMessage, FormLabel, Stack } from '@chakra-ui/core';
import { Button } from 'app/components';
import { useFormik } from 'formik';
import React from 'react';
import { CirclePicker } from 'react-color';
import * as yup from 'yup';
import { ModalContainerOptions, Input } from 'app/components';
import { Team } from '../../settings.types';

const validationSchema = yup.object().shape({
  name: yup.string().trim().required('Team name is required'),
  color: yup.string().trim().required('Color is required'),
});

export type TeamFormValues = yup.InferType<typeof validationSchema> & { id?: Team['id'] };

export type TeamFormProps = {
  isLoading?: boolean;
  initialValues?: TeamFormValues | Team | null;
  onSubmit?(values: TeamFormValues | Team, callback: () => void): void;
  onClose: ModalContainerOptions['onClose'];
};

export function TeamForm({ onClose, onSubmit, isLoading, initialValues }: TeamFormProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (values: TeamFormValues | Team) => {
    onSubmit && onSubmit(values, formik.resetForm);
  };

  const handleClose = () => {
    formik.resetForm();
    onClose && onClose();
  };

  const formik = useFormik<TeamFormValues | Team>({
    validationSchema,
    initialValues: initialValues || {
      name: '',
      color: '#f44336',
    },
    onSubmit: handleSubmit,
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Box marginBottom="1.5rem">
        <FormControl isInvalid={!!formik.touched.name && !!formik.errors.name}>
          <FormLabel color="#333333" fontSize="0.875rem">
            Team Name
          </FormLabel>
          <Input
            size="sm"
            name="name"
            ref={inputRef}
            value={formik.values.name}
            onChange={formik.handleChange}
            placeholder="Give your team a name"
          />
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
      </Box>
      <Box marginBottom="2rem">
        <FormControl isInvalid={!!formik.touched.color && !!formik.errors.color}>
          <FormLabel color="#333333" fontSize="0.875rem" marginBottom="20px">
            Team Colour
          </FormLabel>
          <CirclePicker
            color={formik.values.color}
            width="100%"
            circleSize={36}
            onChangeComplete={color => {
              formik.setFieldValue('color', color.hex);
            }}
          />
        </FormControl>
      </Box>
      <Stack marginY="1.25rem" isInline justifyContent="flex-end">
        <Button size="sm" type="button" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="sm" type="submit" isLoading={isLoading} variantColor="blue">
          Save
        </Button>
      </Stack>
    </form>
  );
}
