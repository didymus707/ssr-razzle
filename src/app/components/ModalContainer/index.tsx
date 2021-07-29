import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalSizes,
  IModal,
  BoxProps,
} from '@chakra-ui/core';

export interface ModalContainerOptions {
  title?: string;
  isOpen?: boolean;
  size?: ModalSizes;
  onOpen?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  children?: React.ReactNode;
  titleStyleProps?: BoxProps;
}

export function ModalContainer({
  title,
  isOpen,
  onClose,
  children,
  size = 'lg',
  showCloseButton,
  initialFocusRef,
  isCentered = true,
  titleStyleProps,
  ...rest
}: ModalContainerOptions & IModal) {
  return (
    <>
      <Modal
        size={size}
        isOpen={isOpen}
        onClose={onClose}
        isCentered={isCentered}
        initialFocusRef={initialFocusRef}
        {...rest}
      >
        <ModalOverlay />
        <ModalContent borderRadius="16px">
          {title && <ModalHeader {...titleStyleProps}>{title}</ModalHeader>}
          {showCloseButton && <ModalCloseButton />}
          {children}
        </ModalContent>
      </Modal>
    </>
  );
}
