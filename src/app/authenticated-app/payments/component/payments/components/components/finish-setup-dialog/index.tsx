import React, { useState } from 'react';
import { CompletePaymentSetupDialogWrapper as Wrapper } from './index.styles';
import { Box, Input, Modal, ModalCloseButton, ModalOverlay, useToast } from '@chakra-ui/core/dist';
import { ToastBox, Button } from 'app/components';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  prompt: string;
  verify: Function;
}

export const CompletePaymentSetupDialog = (props: Props) => {
  const [value, setValue] = useState('');
  const { isOpen, onClose } = props;
  const { prompt, verify, isLoading } = props;

  const toast = useToast();

  const handleVerify = async () => {
    const res = await verify(value);
    if (!res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Incorrect or invalid OTP provided" />
        ),
      });
    } else {
      setValue('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton size="sm" />
      <Wrapper>
        <Box className="heading">Verify your account with OTP</Box>
        <Box className="prompt-text">{prompt}</Box>
        <Box display="flex" mb="15px">
          <Input
            size="sm"
            mr="15px"
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
          />
          <Button
            size="sm"
            variant="solid"
            fontWeight="500"
            isLoading={isLoading}
            onClick={handleVerify}
            isDisabled={value.length === 0}
          >
            Verify
          </Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
