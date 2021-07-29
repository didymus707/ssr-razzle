import {
  Box,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
} from '@chakra-ui/core';
import { Button, FormLabel, Input } from 'app/components';
import { FormikConfig, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import { ColorPicker } from '../../components/filters/ColorPicker';
import { InboxTag } from '../../inbox.types';

export type TagFormValues = Partial<InboxTag> & { color: string };

export type TagFormProps = {
  isLoading?: boolean;
  isDeleting?: boolean;
  onDelete?(): void;
  onCancel?(): void;
  initialValues?: TagFormValues;
  onSubmit: FormikConfig<TagFormValues>['onSubmit'];
};

export const TagForm = (props: TagFormProps) => {
  const { onSubmit, isLoading, isDeleting, onDelete, onCancel, initialValues } = props;
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik<TagFormValues>({
    onSubmit,
    enableReinitialize: true,
    initialValues: initialValues ?? { name: '', color: '#DA9728', description: '' },
    validationSchema: yup.object().shape({
      name: yup.string().required('Tag name is required'),
    }),
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <FormLabel>Name</FormLabel>
      <Input
        mb="4rem"
        name="name"
        ref={inputRef}
        value={values.name}
        onChange={handleChange}
        errorMessage={errors.name}
        placeholder="Enter tag name"
        isInvalid={!!touched.name && !!errors.name}
        rightIcon={
          <Popover isOpen={isOpen} onClose={close}>
            <PopoverTrigger>
              <Button size="xs" onClick={open} variant="unstyled">
                <Box bg={values.color} rounded="4px" width="1rem" height="1rem" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              zIndex={4}
              top="2rem"
              right="0"
              width="200px"
              borderWidth="0"
              position="absolute"
              onClick={e => e.stopPropagation()}
              boxShadow="0px 10px 15px rgba(0, 0, 0, 0.06)"
              _focus={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.06)' }}
            >
              <PopoverBody>
                <ColorPicker
                  color={values.color ?? ''}
                  onChange={color => setFieldValue('color', color)}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        }
      />
      <Flex pt="1.5rem" borderTopWidth="1px" alignItems="center" justifyContent="space-between">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Stack isInline alignItems="center">
          {initialValues && (
            <Button isLoading={isDeleting} onClick={onDelete} variantColor="red" variant="outline">
              Delete tag
            </Button>
          )}
          <Button type="submit" isLoading={isLoading} variantColor="blue">
            Save
          </Button>
        </Stack>
      </Flex>
    </form>
  );
};
