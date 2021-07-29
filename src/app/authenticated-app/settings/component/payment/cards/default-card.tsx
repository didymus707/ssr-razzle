// @ts-nocheck
import { Box } from '@chakra-ui/core';
import React from 'react';

export const DefaultCard = ({ data }) => {
  return (
    <Box>
      <Box className="credit-card-default">
        <img
          alt="credit card"
          className="card-logo"
          src={`/images/credit-cards/${data.brand}.svg`}
        />

        <Box className="info">
          <Box className="primary">{`•••• ${data.last4}`}</Box>
          <Box className="secondary">{`Expires ${data.exp_month}/${data.exp_year}`}</Box>
        </Box>
      </Box>
    </Box>
  );
};
