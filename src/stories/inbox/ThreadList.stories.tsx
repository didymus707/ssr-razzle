//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import * as ThreadItem from './ThreadItem.stories';
import { ThreadList, ThreadListProps } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/ThreadList',
  component: ThreadList,
} as Meta;

const Template: Story<ThreadListProps> = args => <ThreadList {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  threads: [ThreadItem.Primary.args?.thread],
  hasMore: false,
  isFetching: false,
};
