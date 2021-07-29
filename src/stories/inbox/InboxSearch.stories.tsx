//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  InboxSearch,
  InboxSearchProps,
  SearchFileItem,
  SearchPeopleItem,
} from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/Search',
  component: InboxSearch,
} as Meta;

const Template: Story<InboxSearchProps> = args => <InboxSearch {...args} />;

export const Primary = Template.bind({});
Primary.args = {};

export const Loading = Template.bind({});
Loading.args = {
  isSearching: true,
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  children: (
    <>
      <SearchPeopleItem {...{ name: 'Tioluwani Kolawole', platform_name: 'Tioluwani' }} />
      <SearchPeopleItem {...{ name: 'Collins Iheagwara', platform_name: 'Collins' }} />
      <SearchFileItem {...{ name: 'Collins Iheagwara' }} />
    </>
  ),
};
