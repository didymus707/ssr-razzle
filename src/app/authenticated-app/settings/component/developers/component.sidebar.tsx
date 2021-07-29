import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Box, Flex, Icon } from '@chakra-ui/core';

export const DeveloperSidebar = (props: RouteComponentProps) => {
  const { match } = props;
  const router_history = useHistory();

  type Link = { label: string; icon: string; url: string };

  const links: Link[] = [
    {
      label: 'API Keys',
      icon: 'api',
      url: `${match.url}/api-keys`,
    },
    {
      label: 'Web Hooks',
      icon: 'webhook',
      url: `${match.url}/webhooks`,
    },
    {
      label: 'Events',
      icon: 'event',
      url: `${match.url}/events`,
    },
    {
      label: 'Logs',
      icon: 'log',
      url: `${match.url}/logs`,
    },
  ];

  return (
    <div className="side-bar">
      {links.map((i: Link, index: number) => (
        <Box
          key={index}
          className={`option-item ${i.url === router_history.location.pathname && 'active'}`}
          onClick={() => router_history.push(i.url)}
        >
          <Flex className="text" align="center" w="100%">
            <Icon size="24px" name={i.icon} w="15%" />
            {i.label}
          </Flex>
        </Box>
      ))}
    </div>
  );
};
