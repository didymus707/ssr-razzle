//@ts-nocheck
import { Meta, Story } from '@storybook/react';
import { Inbox } from 'app/authenticated-app/inbox';
import React from 'react';

export default {
  title: 'Inbox/Home',
  component: Inbox,
} as Meta;

const Template: Story = args => <Inbox {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
