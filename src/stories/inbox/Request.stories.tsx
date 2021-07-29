//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Request } from 'app/authenticated-app/inbox/components';

export default {
  title: 'Inbox/Request',
  component: Request,
} as Meta;

const Template: Story<any> = args => <Request {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isModalOpened: true,
  paymentRequest: {
    items: [{ name: '', price: 0, quantity: 1 }],
  },
};
