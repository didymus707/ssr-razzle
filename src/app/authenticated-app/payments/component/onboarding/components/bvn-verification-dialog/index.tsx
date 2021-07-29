import React, { useState } from 'react';
import { Modal, ModalCloseButton, ModalOverlay, useToast } from '@chakra-ui/core';
import { BVNVerificationDialogWrapper as Wrapper } from './index.styles';
import { Box, Input } from '@chakra-ui/core/dist';
import { ToastBox, Button } from 'app/components';

interface Props {
  isOpen: boolean;
  bvn: string;
  verify: Function;
  verificationData: { [key: string]: any } | null;
  onClose: () => void;
}

export const BVNVerificationDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const { verificationData, verify } = props;

  const toast = useToast();

  const handleVerify = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalCloseButton size="sm" />
      <Wrapper>
        <Box className="heading">Verify BVN (OTP)</Box>
        <Box className="prompt-text">{verificationData?.message}</Box>
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
            isLoading={loading}
            isDisabled={value.length === 0}
            onClick={handleVerify}
          >
            Verify
          </Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
