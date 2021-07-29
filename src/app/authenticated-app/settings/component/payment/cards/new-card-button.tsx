// @ts-nocheck
import React from 'react';
import { Box } from '@chakra-ui/core';

export const NewCardButton = ({ onClick }) => (
  <Box onClick={onClick} className="new-credit-card-button">
    + New Card
  </Box>
);
