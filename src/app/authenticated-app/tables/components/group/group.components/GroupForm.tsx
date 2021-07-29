import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from '@chakra-ui/core';
import { useFormik } from 'formik';
import * as React from 'react';
import * as yup from 'yup';
import { GroupFormValues } from '../group.types';

export const validationSchema = yup.object().shape({
  name: yup.string().required('Password is required'),
});

export function GroupForm({
  onSubmit,
  onCancel,
  isLoading,
  initialValues,
}: {
  isLoading?: boolean;
  onCancel: () => void;
  initialValues?: GroupFormValues;
  onSubmit: (values: GroupFormValues, callback: () => void) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const formik = useFormik({
    validationSchema,
    initialValues: initialValues || { name: '', id: '' },
    onSubmit: (values: GroupFormValues) => onSubmit(values, handleClose),
  });

  function handleClose() {
    formik.resetForm();
    onCancel();
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl mb="1rem" isInvalid={!!formik.errors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          size="sm"
          id="name"
          type="text"
          name="name"
          ref={inputRef}
          placeholder="Group name"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
      </FormControl>
      <Stack isInline justifyContent="flex-end">
        <Button
          size="sm"
          fontWeight="normal"
          type="button"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          type="submit"
          fontWeight="normal"
          isLoading={isLoading}
          variantColor="blue"
        >
          Save
        </Button>
      </Stack>
    </form>
  );
}
