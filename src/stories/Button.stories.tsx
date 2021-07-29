//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button } from '@app/components';
import { ButtonProps } from '@chakra-ui/core';

export default {
  title: 'Design System/Button',
  component: Button,
} as Meta;

const Template: Story<ButtonProps> = args => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'solid',
  variantColor: 'blue',
  children: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'lg',
  children: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: 'Button',
};
