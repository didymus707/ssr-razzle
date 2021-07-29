import React, { useState } from 'react';
import { IconButton, Modal, ModalOverlay } from '@chakra-ui/core';
import { DeleteAllModalWrapper as Wrapper } from './index.styles';
import { Box, useToast } from '@chakra-ui/core/dist';
import { ToastBox, Button } from 'app/components';

interface Props {
  isOpen: boolean;
  trashCount: number;
  onClose: () => void;
  onProceed: Function;
}

export const DeleteAllConfirmationDialog = ({ isOpen, onClose, trashCount, onProceed }: Props) => {
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handleProceed = async () => {
    setLoading(true);
    const res = await onProceed();

    if (res) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox status="success" onClose={onClose} message="Trash cleared successfully" />
        ),
      });
      onClose();
    } else {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to delete trash lists, please try again" />
        ),
      });
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <Wrapper>
        <IconButton
          position="absolute"
          aria-label="close"
          icon="small-close"
          variant="solid"
          variantColor="blue"
          borderRadius="15px"
          size="xs"
          right="-10px"
          top="-10px"
          onClick={onClose}
        />

        <Box fontSize="20px" fontWeight="600" marginBottom="15px">
          Clear Trash
        </Box>

        <Box marginBottom="15px" fontSize="14px">
          Are you sure you want to clear all {trashCount} list(s) from your trash? This action is
          irreversible
        </Box>

        <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
          <Button
            variant="solid"
            variantColor="red"
            size="sm"
            onClick={handleProceed}
            isLoading={loading}
          >
            Clear Trash
          </Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
