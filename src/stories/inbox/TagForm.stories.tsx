//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { TagForm } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/TagForm',
  component: TagForm,
} as Meta;

const Template: Story<any> = args => <TagForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
