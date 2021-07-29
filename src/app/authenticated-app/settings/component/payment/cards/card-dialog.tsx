// @ts-nocheck
import { Box, Modal, ModalBody, ModalContent, ModalOverlay, useToast } from '@chakra-ui/core';
import React, { useEffect, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { ToastBox, Button } from '../../../../../components';
import { DialogWrapper } from '../index.styles';

const PromptPaystack = ({ close, profile, wallet_id, wallet_email }) => {
  const [loading, setLoading] = useState(false);

  const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;
  const config = {
    amount: 50 * 100,
    channels: ['card'],
    email: wallet_email ?? '',
    publicKey: publicKey || '',
    first_name: profile?.first_name,
    last_name: profile?.last_name,
    metadata: {
      wallet_id,
      refund: true,
      save_card: true,
      purpose: 'card-authorization',
    },
  };
  // @ts-ignore
  const initializePayment = usePaystackPayment(config);

  const handlePaymentSuccess = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      close();
    }, 3000);
  };

  return (
    <Box>
      <Box>
        You'll be redirected to a secured page where your card details would be collected a small
        charge will be placed for verification. A complete refund would be processed immediately
      </Box>

      <form className="actions">
        <>
          <Button
            variantColor="blue"
            isLoading={loading}
            className="prompt-button"
            onClick={() => {
              close();
              initializePayment(handlePaymentSuccess, close);
            }}
          >
            Proceed
          </Button>
          <Button className="prompt-button secondary" variant="ghost" onClick={close}>
            Cancel
          </Button>
        </>
      </form>
    </Box>
  );
};

export const CardDialog = ({
  isOpen,
  onClose,
  initializeCard,
  isLoading,
  profile,
  wallet_id,
  wallet_email,
}) => {
  const [stage, setStage] = useState('prompt-paystack');
  const [initialization, setInitialization] = useState(null);

  useEffect(() => {
    setStage('prompt-paystack');
    setInitialization(null);
  }, [isOpen]);

  const toast = useToast();

  const fetchInitialization = async provider => {
    const _initialization = await initializeCard(provider);
    if (!_initialization) {
      toast({
        position: 'bottom-left',
        render: ({ onClose }) => (
          <ToastBox onClose={onClose} message="Unable to initialize card, please try again" />
        ),
      });
    }

    if (provider === 'paystack') window.open(_initialization.authorization_url, '_blank');
    if (provider === 'stripe') setStage('prompt-stripe');

    setInitialization(_initialization);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent minW="450px" borderRadius="5px" mb="15rem" fontSize="20px">
        <ModalBody>
          <DialogWrapper>
            <Box className="heading">Add Card</Box>
            {stage === 'prompt-paystack' && (
              <PromptPaystack
                setStage={setStage}
                fetchInitialization={fetchInitialization}
                initialization={initialization}
                isLoading={isLoading}
                profile={profile}
                wallet_id={wallet_id}
                wallet_email={wallet_email}
                close={onClose}
              />
            )}
          </DialogWrapper>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
