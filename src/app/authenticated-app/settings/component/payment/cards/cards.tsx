// @ts-nocheck

import React, { useState } from 'react';
import { Box, IconButton, Spinner, Text, useToast, Icon } from '@chakra-ui/core';
import { DefaultCard } from './default-card';
import { NewCardButton } from './new-card-button';
import { CardDialog } from './card-dialog';
import { ToastBox, Button } from '../../../../../components';

export const Cards = ({
  cards,
  default_card: default_card_id,
  changeDefaultCard,
  change_default_card_loading,
  initializeCard,
  card_form_loading,
  fetchCards,
  cards_loading,
  user,
  profile,
  deleteCard,
  delete_card_loading,
  wallet_id,
  wallet_email,
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const toast = useToast();

  const closeDialog = () => {
    setShowDialog(false);
    fetchCards();
  };

  const default_card = cards.find(i => i.id === default_card_id);

  const handleChangeCard = async card_id => {
    const res = await changeDefaultCard(card_id);
    let message = 'Default card changed successfully';
    if (!res) message = 'Unable to set default card, please try again';
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
    });
  };

  const handleDeleteCard = async card_id => {
    const res = await deleteCard(card_id);
    let message = 'Card deleted successfully';
    if (!res) message = 'Unable to delete card, please try again';
    toast({
      position: 'bottom-left',
      render: ({ onClose }) => <ToastBox onClose={onClose} message={message} />,
    });
  };

  return (
    <>
      <Box>
        <Box className="section-top-card">
          {default_card && <DefaultCard data={default_card} />}
          <NewCardButton onClick={() => setShowDialog(true)} />
        </Box>
        <Box className="cards-list">
          {cards.map(i => (
            <Box className="item" key={i.id}>
              <Box display="flex">
                <img
                  alt="credit card"
                  className="card-logo"
                  src={`/images/credit-cards/${i.brand}.svg`}
                />
                <Box>
                  <Box className="text-primary">{`••••  ${i.last4}`}</Box>
                  <Box className="text-secondary">{`Exp ${i.exp_month}/${i.exp_year}`}</Box>
                </Box>
              </Box>

              <Box className="actions">
                <IconButton
                  aria-label="delete card"
                  icon="trash"
                  color="#FE3636"
                  backgroundColor="white"
                  size="md"
                  fontSize="20px"
                  isDisabled={i.id === default_card_id}
                  isLoading={delete_card_loading.includes(i.id)}
                  onClick={() => handleDeleteCard(i.id)}
                />

                {i.id !== default_card_id ? (
                  <Button
                    color="#1A1A1A"
                    fontSize="15px"
                    fontFamily="Averta"
                    backgroundColor="white"
                    onClick={() => handleChangeCard(i.id)}
                    isDisabled={!!change_default_card_loading}
                    isLoading={change_default_card_loading === i.id}
                  >
                    Set as default
                  </Button>
                ) : (
                  <Box display="flex" alignItems="center">
                    <Text color="#1A1A1A" fontSize="15px" fontWeight="400" fontFamily="Averta">
                      Default
                    </Text>
                    <Icon size="20px" name="check-circle" color="#47B881" />
                  </Box>
                )}
              </Box>
            </Box>
          ))}
          {cards_loading && (
            <Box width="100%" marginTop="50px" display="flex">
              <Spinner margin="auto" />
            </Box>
          )}
        </Box>
      </Box>
      <CardDialog
        isOpen={showDialog}
        onClose={closeDialog}
        initializeCard={initializeCard}
        isLoading={card_form_loading}
        user={user}
        profile={profile}
        wallet_id={wallet_id}
        wallet_email={wallet_email}
      />
    </>
  );
};
