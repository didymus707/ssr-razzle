//@ts-nocheck
import { Box, Grid, Icon, Stack } from '@chakra-ui/core';
import { Meta } from '@storybook/react';
import React from 'react';
import { customIcons } from '../app/components/Theme/icons'

const Icons = ({ name }) => {
  const keys = Object.keys(customIcons);
  const names = ['segment', 'sendGrid', 'wooCommerce', 'mambu', 'temenos', 'mailchimp', 'sqlServer', 'mongoDb', 'flutterwave', 'marketing-one-time-payment']

  return (
    <Grid templateColumns='repeat(auto-fit, minmax(120px, 1fr))' templateRows='auto' gap={5}>
      {keys.map((key: any) => (
        <Box 
          key={key}
          border='1px solid #e2e8f0' 
          borderRadius='4px' 
          p={3}
        >
          <Stack
            alignItems='center'
            justifyContent='center'
            textAlign='center'
          >
            <Icon name={key} size={names.includes(key) ? '32px' : '16px'} />
            <p>{key}</p>
          </Stack>
        </Box>
      ))}
    </Grid>
  )
};

export default {
  title: 'Design System/Icons',
  component: Icons,
} as Meta;

const Template: Story<any> = args => <Icons {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
