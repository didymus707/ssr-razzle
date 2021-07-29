//@ts-nocheck
import { Meta, Story } from '@storybook/react';
import {
  TemplateModal,
  TemplateModalProps,
} from 'app/authenticated-app/marketing/templates/components';
import React from 'react';

export default {
  title: 'Design System/TemplateModal',
  component: TemplateModal,
} as Meta;

const Template: Story<TemplateModalProps> = args => <TemplateModal {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  isOpen: true,
  lists_by_id: ['0bc9da739dd3532bbd687fa1bfcc8cec'],
  listOptions: [{ label: 'Contact', value: '0bc9da739dd3532bbd687fa1bfcc8cec' }],
  lists: {
    '0bc9da739dd3532bbd687fa1bfcc8cec': {
      id: '0bc9da739dd3532bbd687fa1bfcc8cec',
      name: 'Contact',
      type: 'contact',
      columns: [
        {
          id: 1,
          name: 'name',
          type: 'TEXT',
          label: 'Name',
          hidden: false,
        },
        {
          id: 2,
          name: 'email',
          type: 'EMAIL',
          label: 'Email Address',
          hidden: false,
        },
        {
          id: 3,
          name: 'phone',
          type: 'PHONE NUMBER',
          label: 'Phone Number',
          hidden: false,
        },
      ],
      color: null,
      icon: null,
      created_datetime: '2021-06-16T03:50:36.381Z',
      updated_datetime: null,
    },
  },
};
