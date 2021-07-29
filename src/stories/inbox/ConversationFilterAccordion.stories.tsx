//@ts-nocheck
import { Stack } from '@chakra-ui/core';
import { Meta, Story } from '@storybook/react';
import {
  ConversationFilterAccordion,
  ConversationFilterAccordionItem,
  ConversationFilterAccordionProps,
} from 'app/authenticated-app/inbox';
import React from 'react';
import * as ConversationFilterAccordionItemStories from './ConversationFilterAccordionItem.stories';

export default {
  title: 'Inbox/ConversationFilterAccordion',
  component: ConversationFilterAccordion,
} as Meta;

const Template: Story<ConversationFilterAccordionProps> = args => (
  <ConversationFilterAccordion {...args} />
);

export const FilterByType = Template.bind({});
FilterByType.args = {
  title: 'Inbox',
  children: (
    <Stack>
      {[
        { ...ConversationFilterAccordionItemStories.New.args },
        { ...ConversationFilterAccordionItemStories.Assigned.args },
        { ...ConversationFilterAccordionItemStories.Mentioned.args },
        { ...ConversationFilterAccordionItemStories.Favorite.args },
        { ...ConversationFilterAccordionItemStories.Closed.args },
        { ...ConversationFilterAccordionItemStories.Drafts.args },
        { ...ConversationFilterAccordionItemStories.Snoozed.args },
      ].map((item, index) => (
        <ConversationFilterAccordionItem key={index.toString()} {...item} />
      ))}
    </Stack>
  ),
};

export const FilterByChannel = Template.bind({});
FilterByChannel.args = {
  title: 'Channels',
  children: (
    <Stack>
      {[
        { ...ConversationFilterAccordionItemStories.Whatsapp.args },
        { ...ConversationFilterAccordionItemStories.Twitter.args },
        { ...ConversationFilterAccordionItemStories.Messenger.args },
        { ...ConversationFilterAccordionItemStories.SMS.args },
      ].map((item, index) => (
        <ConversationFilterAccordionItem key={index.toString()} {...item} />
      ))}
    </Stack>
  ),
};

export const FilterByTag = Template.bind({});
FilterByTag.args = {
  title: 'Tags',
  children: (
    <Stack>
      {[{ ...ConversationFilterAccordionItemStories.Urgent.args }].map((item, index) => (
        <ConversationFilterAccordionItem key={index.toString()} {...item} />
      ))}
    </Stack>
  ),
};
