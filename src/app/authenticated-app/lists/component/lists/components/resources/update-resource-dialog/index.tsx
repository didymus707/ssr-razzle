// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Box, Modal, ModalCloseButton, ModalOverlay, useToast } from '@chakra-ui/core/dist';
import { AddResourceDialogWrapper as Wrapper } from './index.styles';
import { ToastBox, Button, Input } from 'app/components';
import { useSelector } from 'react-redux';
import { selectListResources } from '../../../../../lists.selectors';
import { Checkbox, SlideIn } from '@chakra-ui/core';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedResource: string | null;
  updateResource: Function;
  enableResourceWebhook: Function;
  disableResourceWebhook: Function;
}

export const UpdateResourceDialog = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [resource, setResource] = useState(false);
  const [payload, setPayload] = useState();
  const [resourceName, setResourceName] = useState('');
  const [resourceType, setResourceType] = useState(null);

  const { isOpen, onClose, selectedResource } = props;

  const toast = useToast();

  const resources: any[] = useSelector(selectListResources);

  useEffect(() => {
    setLoading(false);
    setResourceName('');
    setResourceType(null);
    setPayload(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedResource) {
      const resource = resources.find((i: any) => i.id === selectedResource);
      setResource(resource);
      setResourceName(resource.name);
      setResourceType(resource.provider);

      setPayload({
        name: resource.name,
        webhooks_enabled: resource.webhooks_enabled,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await props.updateResource(selectedResource, payload);

      if (payload.webhooks_enabled !== resource.webhooks_enabled) {
        if (payload.webhooks_enabled) {
          await props.enableResourceWebhook(resource.id, resource.provider);
        } else {
          await props.disableResourceWebhook(resource.id, resource.provider);
        }
      }
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox
            status="success"
            onClose={onClose}
            message={`${resource.name} connection updated successfully`}
          />
        ),
      });
      return onClose();
    } catch (e) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to update connection, please try again" />
        ),
      });
    }
    setLoading(false);
  };

  return (
    <SlideIn in={isOpen}>
      {(styles: Object) => (
        <Modal isOpen={true} onClose={onClose}>
          <ModalOverlay />
          <ModalCloseButton size="sm" />
          <Wrapper {...styles}>
            <Box className="heading">Update connection</Box>
            <Box className="prompt-text">Enter new information to update this connection</Box>
            <Box display="flex" flexDirection="column" marginBottom="20px">
              <Box marginBottom="10px">
                <Input
                  label="Name"
                  autoFocus
                  placeholder="i.e Marketing Drive"
                  value={payload?.name || ''}
                  onChange={(e: any) => {
                    setPayload({ ...payload, name: e.target.value });
                  }}
                  isInvalid={!!payload?.name === 0 && isOpen}
                />
              </Box>
            </Box>

            {['shopify', 'woo-commerce'].includes(resourceType) && (
              <Box display="flex" marginBottom="10px">
                <Checkbox
                  isChecked={payload.webhooks_enabled}
                  name="enableSync"
                  onChange={e => setPayload({ ...payload, webhooks_enabled: e.target.checked })}
                  alignItems="center"
                >
                  <Box fontSize="14px" mt="1px">
                    Enable webhook sync
                  </Box>
                </Checkbox>
              </Box>
            )}

            <Box display="flex" flexDirection="row" width="100%" justifyContent="flex-end">
              <Button variant="ghost" size="sm" onClick={onClose} mr="10px">
                Cancel
              </Button>
              <Button
                isDisabled={resourceName.length === 0}
                variantColor="blue"
                variant="solid"
                size="sm"
                isLoading={loading}
                onClick={handleUpdate}
              >
                Update connection
              </Button>
            </Box>
          </Wrapper>
        </Modal>
      )}
    </SlideIn>
  );
};
