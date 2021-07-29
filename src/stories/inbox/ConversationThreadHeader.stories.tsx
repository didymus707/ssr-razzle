//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  ConversationThreadHeader,
  ConversationThreadHeaderProps,
} from 'app/authenticated-app/inbox/components';
import * as ThreadItem from './ThreadItem.stories';
import * as TagsMenu from './TagsMenu.stories';

export default {
  title: 'Inbox/ConversationThreadHeader',
  component: ConversationThreadHeader,
} as Meta;

const Template: Story<ConversationThreadHeaderProps> = args => (
  <ConversationThreadHeader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  thread: ThreadItem.Primary.args?.thread,
  tags: TagsMenu.Primary.args.tags,
};
