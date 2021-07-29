import React from 'react';
import { Icon, Box } from '@chakra-ui/core';
import { useHistory } from 'react-router-dom';

type Link = { label: string; url: string; icon: string; iconSize: string };

export const PaymentsSidebar = () => {
  const router_history = useHistory();

  const links: Link[] = [
    {
      label: 'Payment Requests',
      url: '/s/payments/requests',
      icon: 'dollar',
      iconSize: '16px',
    },
    {
      label: 'Account Balance',
      url: '/s/payments/balance',
      icon: 'premium',
      iconSize: '14px',
    },
    {
      label: 'Transaction History',
      url: '/s/payments/history',
      icon: 'repeat-clock',
      iconSize: '14px',
    },
  ];

  return (
    <div className="side-bar">
      {links.map((i: Link, index: number) => (
        <Box
          key={index}
          className={`option-item ${i.url === router_history.location.pathname && 'active'} `}
          onClick={() => router_history.push(i.url)}
        >
          <Icon name={i.icon} size={i.iconSize} marginRight="10px" />
          <Box className="text">{i.label}</Box>
        </Box>
      ))}
    </div>
  );
};
