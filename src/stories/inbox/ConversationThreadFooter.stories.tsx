//@ts-nocheck
import { Meta, Story } from '@storybook/react';
import {
  ConversationThreadFooter,
  ConversationThreadFooterProps,
} from 'app/authenticated-app/inbox/components';
import React from 'react';

export default {
  title: 'Inbox/ConversationThreadFooter',
  component: ConversationThreadFooter,
} as Meta;

const Template: Story<ConversationThreadFooterProps> = args => (
  <ConversationThreadFooter {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
