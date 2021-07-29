//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ThreadItem, ThreadItemProps } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/ThreadItem',
  component: ThreadItem,
} as Meta;

const Template: Story<ThreadItemProps> = args => <ThreadItem {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  thread: {
    id: 511,
    resolved_datetime: '2021-04-14T11:03:15.000Z',
    state: 'resolved',
    uuid: '7534f3694eb145b1b167c0dacd53a930',
    updated_datetime: '2021-04-14T11:03:15.000Z',
    created_datetime: '2021-04-12T18:50:29.000Z',
    receiver_id: '004f0134f0754c4badb1a0ea04bf1695',
    sender_id: 'bd55e3da71be49d3a72a7655ff078513',
    resolver_id: '5ab599aee39f11ea937086d35ec4f76b',
    receiver: {
      id: 59,
      status: 'disconnected',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '004f0134f0754c4badb1a0ea04bf1695',
      updated_datetime: '2021-04-14T11:03:15.000Z',
      created_datetime: '2021-04-12T18:49:49.000Z',
      user_id: '6efb856d6769485599f5d642115c7c85',
    },
    last_message: {
      id: 10421,
      content: 'Hullo',
      attachments: null,
      meta: {
        type: 'normal',
      },
      p_id: 'whatsappWeb-FC74951628CB3F2A11AC806BE50239D7',
      status: 'sent',
      uuid: 'ee5cda125cae432d993454816627a35e',
      updated_datetime: '2021-04-12T19:45:48.000Z',
      created_datetime: '2021-04-12T19:45:47.000Z',
      author_id: 'bd55e3da71be49d3a72a7655ff078513',
      thread_id: '7534f3694eb145b1b167c0dacd53a930',
    },
    sender: {
      id: 1156,
      email: null,
      name: 'komsic',
      image_url: null,
      channel: 'whatsapp',
      platform_name: 'komsic',
      platform_nick: '2348130867594',
      uuid: 'bd55e3da71be49d3a72a7655ff078513',
      updated_datetime: '2021-04-12T15:37:23.000Z',
      created_datetime: '2021-04-12T15:37:23.000Z',
    },
    last_message_id: 'ee5cda125cae432d993454816627a35e',
    organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
  },
};
