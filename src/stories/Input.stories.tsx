//@ts-nocheck
import { Input, InputProps } from '@app/components';
import { Icon } from '@chakra-ui/core';
import { Meta, Story } from '@storybook/react';
import React from 'react';

export default {
  title: 'Design System/Form/Input',
  component: Input,
} as Meta;

const Template: Story<InputProps> = args => <Input {...args} />;

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

export const WithLeftIcon = Template.bind({});
WithLeftIcon.args = {
  label: 'Phone Number',
  leftIcon: <Icon name="phone" />,
};

export const SmallWithLeftIcon = Template.bind({});
SmallWithLeftIcon.args = {
  size: 'sm',
  label: 'Phone Number',
  leftIcon: <Icon name="phone" />,
};

export const LargeWithLeftIcon = Template.bind({});
LargeWithLeftIcon.args = {
  size: 'lg',
  label: 'Phone Number',
  leftIcon: <Icon name="phone" />,
};

export const WithRightIcon = Template.bind({});
WithRightIcon.args = {
  label: 'Phone Number',
  rightIcon: <Icon name="phone" />,
};

export const SmallWithRightIcon = Template.bind({});
SmallWithRightIcon.args = {
  size: 'sm',
  label: 'Phone Number',
  rightIcon: <Icon name="phone" />,
};

export const LargeWithRightIcon = Template.bind({});
LargeWithRightIcon.args = {
  size: 'lg',
  label: 'Phone Number',
  rightIcon: <Icon name="phone" />,
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'Email',
  type: 'email',
  placeholder: 'Enter your email address',
  isInvalid: true,
  errorMessage: 'Invalid email',
};

export const Disabled = Template.bind({});
Disabled.args = {
  type: 'email',
  label: 'Email',
  isDisabled: true,
  placeholder: 'Enter your email address',
};
