//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  ConversationFilterAccordionItem,
  ConversationFilterAccordionItemProps,
} from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/ConversationFilterAccordionItem',
  component: ConversationFilterAccordionItem,
} as Meta;

const Template: Story<ConversationFilterAccordionItemProps> = args => (
  <ConversationFilterAccordionItem {...args} />
);

export const New = Template.bind({});
New.args = {
  icon: 'inbox-new',
  isActive: true,
  children: 'New',
};

export const Assigned = Template.bind({});
Assigned.args = {
  icon: 'inbox-assigned',
  isActive: false,
  children: 'Assigned to me',
};

export const Mentioned = Template.bind({});
Mentioned.args = {
  icon: 'inbox-mentioned',
  isActive: false,
  children: 'Mentioned',
};

export const Favorite = Template.bind({});
Favorite.args = {
  icon: 'inbox-favorite',
  isActive: false,
  children: 'Favorite',
};

export const Closed = Template.bind({});
Closed.args = {
  icon: 'inbox-closed',
  isActive: false,
  children: 'Closed',
};

export const Drafts = Template.bind({});
Drafts.args = {
  icon: 'inbox-drafts',
  isActive: false,
  children: 'Drafts',
};

export const Snoozed = Template.bind({});
Snoozed.args = {
  icon: 'inbox-snoozed',
  isActive: false,
  children: 'Snoozed',
};

export const Whatsapp = Template.bind({});
Whatsapp.args = {
  icon: 'inbox-whatsapp',
  isActive: false,
  children: 'Whatsapp',
};

export const Twitter = Template.bind({});
Twitter.args = {
  icon: 'inbox-twitter',
  isActive: false,
  children: 'Twitter',
};

export const Messenger = Template.bind({});
Messenger.args = {
  icon: 'inbox-messenger',
  isActive: false,
  children: 'Messenger',
};

export const SMS = Template.bind({});
SMS.args = {
  icon: 'inbox-sms',
  isActive: false,
  children: 'SMS',
};

export const Urgent = Template.bind({});
Urgent.args = {
  icon: 'inbox-tag',
  isActive: false,
  iconColor: '#F77D33',
  children: 'Urgent',
};
