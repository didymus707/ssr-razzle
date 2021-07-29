import React, { useEffect, useState } from 'react';
import { Box, Modal, ModalCloseButton, ModalOverlay, useToast } from '@chakra-ui/core/dist';
import { DeleteDataModelDialogWrapper as Wrapper } from './index.styles';
import { ToastBox, Button } from 'app/components';
import { useSelector } from 'react-redux';
import { selectDataModels } from 'app/authenticated-app/lists/lists.selectors';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedDataModel: string | null;
  deleteDataModel: Function;
}

export const DeleteDataModelDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [dataModel, setDataModel] = useState<any | null>(null);

  const { isOpen, onClose, selectedDataModel } = props;

  const dataModels: any[] = useSelector(selectDataModels);
  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await props.deleteDataModel(selectedDataModel);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${dataModel.name} deleted successfully`}
          />
        ),
      });
      return onClose();
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to delete data model, please try again" />
        ),
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(false);
    if (isOpen && selectedDataModel) {
      const _dataModel = dataModels.find((i: any) => i.id === selectedDataModel);
      setDataModel(_dataModel);
    } else {
      setDataModel(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton size="sm" />

      <Wrapper>
        <Box className="heading">Delete Connection</Box>

        <Box className="prompt-text">Are you sure you want to delete the selected data model?</Box>

        <Box display="flex" flexDirection="row" marginBottom="30px" fontWeight="500">
          {dataModel?.name}
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
            Delete data model
          </Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
