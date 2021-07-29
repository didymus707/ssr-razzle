import { ModalBody, ModalFooter, Stack } from '@chakra-ui/core';
import { BodyText, Button, ModalContainer, ModalContainerOptions, Textarea } from 'app/components';
import { useFormik } from 'formik';
import React from 'react';

export type CloseConversationModalProps = ModalContainerOptions & {
  userNick: string;
  isLoading?: boolean;
  onSubmit(payload: { topic: string; status: string; content: string }): void;
};

export const CloseConversationModal = (props: CloseConversationModalProps) => {
  const { isOpen, onSubmit, userNick, onClose, isLoading } = props;

  const handleClose = () => {
    onClose?.();
  };

  const { values, errors, touched, handleChange, handleSubmit } = useFormik({
    onSubmit,
    initialValues: { topic: '', status: '', content: '' },
  });

  return (
    <ModalContainer size="sm" isOpen={isOpen} onClose={handleClose} title="Close Conversation">
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <BodyText pb="1rem" color="gray.500">
            You are about to close the conversation with {userNick}
          </BodyText>

          {/* <Input
            mb="1rem"
            name="topic"
            placeholder="Topic"
            value={values.topic}
            onChange={handleChange}
            errorMessage={errors.topic}
            isInvalid={!!touched.topic && !!errors.topic}
          />
          <Select
            mb="1rem"
            name="status"
            value={values.status}
            onChange={handleChange}
            placeholder="Choose status"
            errorMessage={errors.status}
            isInvalid={!!touched.status && !!errors.status}
          >
            <option value="resolved">Resolved</option>
            <option value="peding">Pending</option>
          </Select> */}
          <Textarea
            mb="1rem"
            name="content"
            value={values.content}
            onChange={handleChange}
            placeholder="Enter Note"
            errorMessage={errors.content}
            isInvalid={!!touched.content && !!errors.content}
          />
        </ModalBody>
        <ModalFooter>
          <Stack isInline width="100%" justifyContent="center">
            <Button size="sm" width="48%" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="sm" width="48%" type="submit" variantColor="blue" isLoading={isLoading}>
              Close
            </Button>
          </Stack>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};
