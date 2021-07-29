import { ModalBody, ModalFooter, Stack } from '@chakra-ui/core';
import { BodyText, Button, ModalContainer, ModalContainerOptions, Textarea } from 'app/components';
import { useFormik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import { NoteSchema } from '../../inbox.types';

export type NoteModalProps = ModalContainerOptions & {
  isLoading?: boolean;
  initialValues?: Partial<NoteSchema>;
  onSubmit(payload: Partial<NoteSchema>): void;
};
export const NoteModal = (props: NoteModalProps) => {
  const { onClose, isOpen, onSubmit, isLoading, initialValues } = props;
  const { values, touched, errors, handleChange, handleSubmit } = useFormik<Partial<NoteSchema>>({
    onSubmit,
    validationSchema: yup.object().shape({
      content: yup.string().required('Note content is required'),
    }),
    initialValues: initialValues ?? { content: '' },
  });

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      title={`${initialValues ? 'Edit' : 'Add'} note`}
    >
      <form onSubmit={handleSubmit}>
        <ModalBody>
          {!initialValues && (
            <BodyText pb="1rem" color="gray.500">
              Add an internal note to give more context to this conversation.
            </BodyText>
          )}
          <Textarea
            name="content"
            value={values.content}
            onChange={handleChange}
            placeholder="Enter note"
            errorMessage={errors.content}
            isInvalid={!!touched.content && !!errors.content}
          />
        </ModalBody>
        <ModalFooter>
          <Stack isInline width="100%" justifyContent="center">
            <Button size="sm" width="48%" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" width="48%" type="submit" variantColor="blue" isLoading={isLoading}>
              {initialValues ? 'Edit' : 'Add'} note
            </Button>
          </Stack>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};
