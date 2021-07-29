//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SnoozeMenu } from 'app/authenticated-app/inbox/components';

export default {
  title: 'Inbox/SnoozeMenu',
  component: SnoozeMenu,
} as Meta;

const Template: Story<any> = args => <SnoozeMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
