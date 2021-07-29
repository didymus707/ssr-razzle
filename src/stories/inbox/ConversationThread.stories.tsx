//@ts-nocheck
import { Meta, Story } from '@storybook/react';
import {
  ConversationThread,
  ConversationThreadUIProps,
} from 'app/authenticated-app/inbox/components';
import React from 'react';

export default {
  title: 'Inbox/ConversationThread',
  component: ConversationThread,
} as Meta;

const Template: Story<ConversationThreadUIProps> = args => <ConversationThread {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
