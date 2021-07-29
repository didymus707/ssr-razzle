//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { QuickReplyForm } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/QuickReplyForm',
  component: QuickReplyForm,
} as Meta;

const Template: Story<any> = args => <QuickReplyForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
