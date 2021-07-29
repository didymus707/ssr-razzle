import * as React from 'react';
import { Box, Heading, Stack } from '@chakra-ui/core';
import { Wrapper } from './index.styles';
import { Cards } from './cards';
import { BankAccounts } from './bank-accounts';
import { useState } from 'react';

const tab_map: any = {
  bank_account: {
    label: 'Beneficiaries',
    component: BankAccounts,
  },
  card: {
    label: 'Cards',
    component: Cards,
  },
};

export const Payment = (props: any) => {
  const [activeTab, setActiveTab] = useState<string>('bank_account');

  const Component = tab_map[activeTab].component;

  return (
    <Wrapper>
      <Stack isInline alignItems="center" marginBottom="1.5rem" justifyContent="space-between">
        <Heading size="sm" color="#333333" fontWeight="semibold">
          Payment Settings
        </Heading>
      </Stack>
      <Box>
        <Box className="tab-section">
          {Object.keys(tab_map).map(i => (
            <Box
              key={i}
              className={`tab ${activeTab === i && 'active'}`}
              onClick={() => setActiveTab(i)}
            >
              {tab_map[i].label}
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="content-section">
        <Component {...props} />
      </Box>
    </Wrapper>
  );
};
