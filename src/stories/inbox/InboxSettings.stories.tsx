//@ts-nocheck
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { InboxSettings } from 'app/authenticated-app/inbox/settings';

export default {
  title: 'Inbox/Settings/Home',
  component: InboxSettings,
} as Meta;

const Template: Story = args => <InboxSettings {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
