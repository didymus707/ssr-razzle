import { ModalBody, ModalCloseButton } from '@chakra-ui/core';
import { ModalContainer } from 'app/components';
import React from 'react';
import { TemplateForm } from './TemplateForm';
import { TemplateModalProps } from './types';

export function TemplateModal({
  lists,
  title,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  listOptions,
  lists_by_id,
  initialValues,
}: TemplateModalProps) {
  return (
    <ModalContainer title={title} isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalCloseButton size="sm" />
      <ModalBody>
        <TemplateForm
          lists={lists}
          onClose={onClose}
          onSubmit={onSubmit}
          isLoading={isLoading}
          listOptions={listOptions}
          lists_by_id={lists_by_id}
          initialValues={initialValues}
        />
      </ModalBody>
    </ModalContainer>
  );
}
