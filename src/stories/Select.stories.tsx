//@ts-nocheck
import { Select, SelectProps } from '@app/components';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Design System/Form/Select',
  component: Select,
} as Meta;

const Template: Story<SelectProps> = args => <Select {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: 'Field',
  placeholder: 'Enter value here',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  label: 'Field',
  placeholder: 'Enter value here',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  label: 'Field',
  placeholder: 'Enter value here',
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Email',
  isInvalid: true,
  errorMessage: 'Invalid email',
  placeholder: 'Enter your email address',
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Email',
  isDisabled: true,
  placeholder: 'Enter your email address',
};
