import { Box, FormControl, FormLabel, ModalBody, ModalCloseButton } from '@chakra-ui/core';
import { Button, Input, ModalContainer, ModalContainerOptions } from 'app/components';
import React, { useRef } from 'react';

export type InviteMemberModalProps = {
  isLoading?: boolean;
  onSubmit?: (email: string, callback: () => void) => void;
  isOpen: ModalContainerOptions['isOpen'];
  onClose: ModalContainerOptions['onClose'];
};

export function InviteMemberModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: InviteMemberModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    if (email) {
      onSubmit && onSubmit(email, () => setEmail(''));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
  };

  const handleClose = () => {
    setEmail('');
    onClose && onClose();
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite people"
      initialFocusRef={inputRef}
    >
      <ModalCloseButton size="sm" />
      <ModalBody marginBottom="1.5rem">
        <Box marginBottom="1rem">
          <FormControl>
            <FormLabel color="#333333" fontSize="0.875rem">
              Email Address
            </FormLabel>
            <Input
              size="sm"
              value={email}
              ref={inputRef}
              onChange={handleEmailChange}
              placeholder="Enter teammate email address"
            />
          </FormControl>
        </Box>
        <Button
          size="sm"
          isDisabled={!email}
          variantColor="blue"
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          Send Invitation
        </Button>
      </ModalBody>
    </ModalContainer>
  );
}
