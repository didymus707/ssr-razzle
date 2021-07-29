//@ts-nocheck
import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ConversationFilters, ConversationFiltersProps } from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/ConversationFilters',
  component: ConversationFilters,
} as Meta;

const Template: Story<ConversationFiltersProps> = args => <ConversationFilters {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  activeFilter: 'queued',
  channels: [
    {
      id: 10,
      status: 'active',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: 'c9cc8551438a4e8eb254c798fbd74727',
      updated_datetime: '2021-02-24T15:24:06.000Z',
      created_datetime: '2021-02-24T15:24:06.000Z',
      user_id: '8647cd576cf74fe1b33233f38d77fdbf',
      user: {
        id: 11,
        image_url:
          'https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/p50x50/131976361_169383601585843_5487924634647721523_o.png?_nc_cat=105&ccb=3&_nc_sid=dbb9e7&_nc_ohc=4wNJqztQNboAX_dIagE&_nc_ht=scontent.xx&_nc_tp=30&oh=b322c19dc45e644e34c2443ad3667518&oe=605BDE2D',
        email: '["social@simpu.co"]',
        platform_name: 'Simpu',
        platform_nick: 'SimpuHq',
        uuid: '8647cd576cf74fe1b33233f38d77fdbf',
        channel: 'messenger',
        updated_datetime: '2021-02-24T15:24:06.000Z',
        created_datetime: '2021-02-24T15:24:06.000Z',
      },
      connectivities: [
        {
          id: 11,
          disconnected_datetime: null,
          connected_datetime: '2021-02-24T15:24:06.000Z',
          uuid: 'f0b3484dbb2b4d6a8fdb7c6636b9723d',
          updated_datetime: '2021-02-24T15:24:06.000Z',
          created_datetime: '2021-02-24T15:24:06.000Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: 'c9cc8551438a4e8eb254c798fbd74727',
        },
      ],
    },
    {
      id: 3,
      status: 'active',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '785f8f93d9e04202a68e1165ec36c8c2',
      updated_datetime: '2021-01-12T08:06:55.000Z',
      created_datetime: '2021-01-12T08:06:55.000Z',
      user_id: '111f1d4036a44e5cbf3abd46cf97707a',
      user: {
        id: 14,
        image_url: null,
        email: null,
        platform_name: '+447418310508',
        platform_nick: '+447418310508',
        uuid: '111f1d4036a44e5cbf3abd46cf97707a',
        channel: 'whatsapp',
        updated_datetime: '2021-01-12T10:59:23.000Z',
        created_datetime: '2021-01-12T10:59:23.000Z',
      },
      connectivities: [
        {
          id: 13,
          disconnected_datetime: null,
          connected_datetime: '2021-01-12T08:06:55.000Z',
          uuid: '241b41c5c345444ea00c96f598cb2a95',
          updated_datetime: '2021-01-12T08:06:55.000Z',
          created_datetime: '2021-01-12T08:06:55.000Z',
          disconnector_id: null,
          connector_id: '2a176c63e77d11ea937086d35ec4f76b',
          credential_id: '785f8f93d9e04202a68e1165ec36c8c2',
        },
      ],
    },
    {
      id: 15,
      status: 'active',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '484da0ac862c4ef7b9c4d8565230e958',
      updated_datetime: '2021-02-26T10:49:41.000Z',
      created_datetime: '2021-02-26T10:49:41.000Z',
      user_id: '1e06ca38e9df48db936bc8a0e77afa8c',
      user: {
        id: 19,
        image_url: null,
        email: null,
        platform_name: '(855) 875-9716',
        platform_nick: '+18558759716',
        uuid: '1e06ca38e9df48db936bc8a0e77afa8c',
        channel: 'voice',
        updated_datetime: '2021-02-26T10:49:41.000Z',
        created_datetime: '2021-02-26T10:49:41.000Z',
      },
      connectivities: [
        {
          id: 17,
          disconnected_datetime: null,
          connected_datetime: '2021-02-26T10:49:41.000Z',
          uuid: '31a84893915b47d093ca6a12ed68fb6e',
          updated_datetime: '2021-02-26T10:49:41.000Z',
          created_datetime: '2021-02-26T10:49:41.000Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '484da0ac862c4ef7b9c4d8565230e958',
        },
      ],
    },
    {
      id: 23,
      status: 'active',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: 'edfadaa31d5a46e1b23796b65299c3f6',
      updated_datetime: '2021-03-05T16:25:12.000Z',
      created_datetime: '2021-03-05T16:25:12.000Z',
      user_id: '914d9a23a87448c38da91772535ef19d',
      user: {
        id: 69,
        image_url: null,
        email: null,
        platform_name: '(619) 304-4234',
        platform_nick: '+16193044234',
        uuid: '914d9a23a87448c38da91772535ef19d',
        channel: 'voice',
        updated_datetime: '2021-03-05T16:25:12.000Z',
        created_datetime: '2021-03-05T16:25:12.000Z',
      },
      connectivities: [
        {
          id: 27,
          disconnected_datetime: null,
          connected_datetime: '2021-03-05T16:25:12.000Z',
          uuid: '02150c8d22f04b5287c1c16075d6dbb8',
          updated_datetime: '2021-03-05T16:25:12.000Z',
          created_datetime: '2021-03-05T16:25:12.000Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: 'edfadaa31d5a46e1b23796b65299c3f6',
        },
      ],
    },
    {
      id: 39,
      status: 'active',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: 'f3dc09953487461e81a85df2509c3591',
      updated_datetime: '2021-03-19T10:21:01.000Z',
      created_datetime: '2021-03-19T10:21:01.000Z',
      user_id: '00e4564b03f34d5cb38cb661c924e934',
      user: {
        id: 365,
        image_url: null,
        email: null,
        platform_name: '(833) 299-5607',
        platform_nick: '+18332995607',
        uuid: '00e4564b03f34d5cb38cb661c924e934',
        channel: 'voice',
        updated_datetime: '2021-03-19T10:21:01.000Z',
        created_datetime: '2021-03-19T10:21:01.000Z',
      },
      connectivities: [
        {
          id: 60,
          disconnected_datetime: null,
          connected_datetime: '2021-03-19T10:21:01.000Z',
          uuid: '4c181a7d218d4d9f96fe3ba48f35661f',
          updated_datetime: '2021-03-19T10:21:01.000Z',
          created_datetime: '2021-03-19T10:21:01.000Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: 'f3dc09953487461e81a85df2509c3591',
        },
      ],
    },
    {
      id: 40,
      status: 'active',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '3051e4dbfd554417ace592bb7c7fd30c',
      updated_datetime: '2021-03-19T10:21:01.000Z',
      created_datetime: '2021-03-19T10:21:01.000Z',
      user_id: 'a8f89b8de4b8429ab179183e699aded3',
      user: {
        id: 366,
        image_url: null,
        email: null,
        platform_name: '(833) 299-5607',
        platform_nick: '+18332995607',
        uuid: 'a8f89b8de4b8429ab179183e699aded3',
        channel: 'sms',
        updated_datetime: '2021-03-19T10:21:01.000Z',
        created_datetime: '2021-03-19T10:21:01.000Z',
      },
      connectivities: [
        {
          id: 61,
          disconnected_datetime: null,
          connected_datetime: '2021-03-19T10:21:01.000Z',
          uuid: '49314d82c7ca4a639101b2c977dfc4e4',
          updated_datetime: '2021-03-19T10:21:01.000Z',
          created_datetime: '2021-03-19T10:21:01.000Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '3051e4dbfd554417ace592bb7c7fd30c',
        },
      ],
    },
  ],
};
