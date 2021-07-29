import { ModalBody, ModalCloseButton } from '@chakra-ui/core';
import React from 'react';
import { ModalContainer, ModalContainerOptions } from '../../../../components/ModalContainer';
import { TeamForm, TeamFormValues } from './TeamForm';
import { Team } from '../../settings.types';

export type TeamModalProps = {
  title?: string;
  isLoading?: boolean;
  initialValues?: TeamFormValues | Team | null;
  onSubmit?(values: TeamFormValues | Team, callback: () => void): void;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
};

export function TeamModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  initialValues,
  title = 'Create a team',
}: TeamModalProps) {
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <ModalContainer title={title} isOpen={isOpen} onClose={onClose}>
      <ModalCloseButton size="sm" />
      <ModalBody>
        <TeamForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onClose={handleClose}
          initialValues={initialValues}
        />
      </ModalBody>
    </ModalContainer>
  );
}
