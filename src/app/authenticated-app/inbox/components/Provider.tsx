import { useDisclosure } from '@chakra-ui/core';
import { createContext } from 'hooks';
import React, { ReactNode, useState } from 'react';

export const [Provider, useInbox] = createContext<{
  activeFilter: string;
  qrCodeChannelId?: string;
  isNewConversation: boolean;
  isWhatsappModalOpen: boolean;
  onCloseWhatsappModal(): void;
  onOpenWhatsappModal(): void;
  isQRCodeSetupModalOpen: boolean;
  onCloseQRCodeSetupModal(): void;
  onOpenQRCodeSetupModal(): void;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  setIsNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  setQrCodeChannelId: React.Dispatch<React.SetStateAction<string | undefined>>;
}>();

export const InboxProvider = ({ children }: { children: ReactNode }) => {
  const [activeFilter, setActiveFilter] = useState('queued');
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [qrCodeChannelId, setQrCodeChannelId] = useState<string | undefined>();

  const {
    isOpen: isWhatsappModalOpen,
    onClose: onCloseWhatsappModal,
    onOpen: onOpenWhatsappModal,
  } = useDisclosure();
  const {
    isOpen: isQRCodeSetupModalOpen,
    onClose: onCloseQRCodeSetupModal,
    onOpen: onOpenQRCodeSetupModal,
  } = useDisclosure();

  return (
    <Provider
      value={{
        activeFilter,
        qrCodeChannelId,
        setActiveFilter,
        isNewConversation,
        setQrCodeChannelId,
        isWhatsappModalOpen,
        onOpenWhatsappModal,
        setIsNewConversation,
        onCloseWhatsappModal,
        isQRCodeSetupModalOpen,
        onCloseQRCodeSetupModal,
        onOpenQRCodeSetupModal,
      }}
    >
      {children}
    </Provider>
  );
};
