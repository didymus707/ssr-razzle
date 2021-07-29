import { ModalBody } from '@chakra-ui/core';
import * as React from 'react';
import { ModalContainer } from '../../../../../components';
import { GroupModalProps } from '../group.types';
import { GroupForm } from './GroupForm';

export function GroupModal({
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialValues,
}: GroupModalProps) {
  return (
    <ModalContainer
      size="sm"
      title={title}
      isOpen={isOpen}
      showCloseButton
      onClose={onClose}
    >
      <ModalBody>
        <GroupForm
          onCancel={onClose}
          onSubmit={onSubmit}
          isLoading={isLoading}
          initialValues={initialValues}
        />
      </ModalBody>
    </ModalContainer>
  );
}
