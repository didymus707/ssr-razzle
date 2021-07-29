import React, { useEffect, useState } from 'react';
import { Box, Modal, ModalCloseButton, ModalOverlay, useToast } from '@chakra-ui/core/dist';
import { DeleteSegmentDialogWrapper as Wrapper } from './index.styles';
import { ToastBox, Button } from 'app/components';
import { useSelector } from 'react-redux';
import { selectSegments } from 'app/authenticated-app/lists/lists.selectors';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedSegment: string | null;
  deleteSegment: Function;
}

export const DeleteSegmentDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [segment, setSegment] = useState<any | null>(null);

  const { isOpen, onClose, selectedSegment } = props;

  const segments: any[] = useSelector(selectSegments);
  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await props.deleteSegment(selectedSegment);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${segment.name} deleted successfully`}
          />
        ),
      });
      return onClose();
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to delete segment, please try again" />
        ),
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(false);
    if (isOpen && selectedSegment) {
      const _segment = segments.find((i: any) => i.id === selectedSegment);
      setSegment(_segment);
    } else {
      setSegment(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton size="sm" />

      <Wrapper>
        <Box className="heading">Delete Connection</Box>

        <Box className="prompt-text">Are you sure you want to delete the selected segment?</Box>

        <Box display="flex" flexDirection="row" marginBottom="30px" fontWeight="500">
          {segment?.name}
        </Box>
        <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
          <Button variant="ghost" size="sm" onClick={onClose} mr="10px">
            Cancel
          </Button>
          <Button
            variantColor="red"
            variant="solid"
            size="sm"
            isLoading={loading}
            onClick={handleDelete}
          >
            Delete segment
          </Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
