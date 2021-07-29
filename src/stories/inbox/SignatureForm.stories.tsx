//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SignatureForm } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/SignatureForm',
  component: SignatureForm,
} as Meta;

const Template: Story<any> = args => <SignatureForm {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
