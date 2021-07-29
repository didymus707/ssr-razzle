// @ts-nocheck
import React, { useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  SlideIn,
  Text,
} from '@chakra-ui/core';
import { Button } from 'app/components';

interface Props {
  isOpen: boolean;
  isLoading: boolean;
  close: Function;
  onConfirm: Function;
}

export const CreateSmartListDialog = (props: Props) => {
  const { isOpen, close, onConfirm, isLoading } = props;
  const inputRef = useRef(null);

  return (
    <SlideIn in={isOpen}>
      {styles => (
        <Modal isOpen={true} onClose={() => close()} isCentered>
          <ModalOverlay opacity={styles.opacity} />
          <ModalContent borderRadius="5px" {...styles}>
            <ModalHeader>Create Smart List</ModalHeader>
            <ModalCloseButton size="sm" />
            <ModalBody>
              <Text>Name</Text>
              <Input
                mt="5px"
                paddingX="10px"
                width="100%"
                placeholder="Smart list name"
                ref={inputRef}
                autoFocus
              />
            </ModalBody>
            <ModalFooter fontWeight="500">
              <Button variant="ghost" fontSize="14px" mr="10px" onClick={() => close()}>
                Cancel
              </Button>
              <Button
                color="white"
                backgroundColor="#3D43DF"
                variantColor="blue"
                fontSize="14px"
                padding="4px 10px"
                onClick={() => onConfirm(inputRef.current.value)}
                isLoading={isLoading}
              >
                Create
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </SlideIn>
  );
};
