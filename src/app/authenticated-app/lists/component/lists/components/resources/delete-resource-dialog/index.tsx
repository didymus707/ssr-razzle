import React, { useEffect, useState } from 'react';
import { Box, Icon, Modal, ModalCloseButton, ModalOverlay, useToast } from '@chakra-ui/core/dist';
import { DeleteResourceDialogWrapper as Wrapper } from './index.styles';
import { ToastBox, Button } from 'app/components';
import { useSelector } from 'react-redux';
import { selectListResources } from 'app/authenticated-app/lists/lists.selectors';
import { resource_types } from 'app/authenticated-app/lists/list.data';
import { getListResourceIcon } from 'app/authenticated-app/lists/lists.utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedResource: string | null;
  deleteResource: Function;
}

export const DeleteResourceDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [resourceName, setResourceName] = useState('');

  const { isOpen, onClose, selectedResource } = props;

  const resources: any[] = useSelector(selectListResources);

  const resourceType = resource_types.find(
    (i: any) => resources.find((i: any) => i.id === selectedResource)?.['provider'] === i.key,
  );

  useEffect(() => {
    setLoading(false);
    setResourceName('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedResource) {
      const resource = resources.find((i: any) => i.id === selectedResource);
      setResourceName(resource?.name || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const toast = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await props.deleteResource(selectedResource);
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${resourceName} connection deleted successfully`}
          />
        ),
      });
      return onClose();
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to delete connection, please try again" />
        ),
      });
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalCloseButton size="sm" />

      <Wrapper>
        <Box className="heading">Delete Connection</Box>

        <Box className="prompt-text">
          Are you sure you want to delete the selected {resourceType?.label} connection?
        </Box>

        <Box display="flex" flexDirection="row" marginBottom="30px" fontWeight="500">
          <Icon
            name={getListResourceIcon(resourceType?.key || 'google-sheets')}
            mr="10px"
            size="24px"
          />
          {resourceName}
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
            Delete connection
          </Button>
        </Box>
      </Wrapper>
    </Modal>
  );
};
