//@ts-nocheck
import React from 'react';
import { Story, Meta } from '@storybook/react';
import {
  ConnectionWarningPrompt,
  ConnectionWarningPromptProps,
  InboxProvider,
} from 'app/authenticated-app/inbox';

export default {
  title: 'Inbox/ConnectionWarningPrompt',
  component: ConnectionWarningPrompt,
} as Meta;

const Template: Story<ConnectionWarningPromptProps> = args => (
  <InboxProvider>
    <ConnectionWarningPrompt {...args} />
  </InboxProvider>
);

export const One = Template.bind({});
One.args = {
  credentialsWithIssue: [
    {
      id: 6,
      status: 'replaced',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '03f3795cf7ff4a509bfe35215fbc90c9',
      updated_datetime: '2021-05-22T10:55:29.820Z',
      created_datetime: '2021-02-24T11:30:06.000Z',
      user_id: '50b84359d03a4d609c49f7da56d488da',
      user: {
        id: 7,
        image_url: 'https://pbs.twimg.com/profile_images/1356896177195782150/ACtRF0pm_normal.jpg',
        email: null,
        platform_name: 'Simpu',
        platform_nick: 'SimpuHQ',
        uuid: '50b84359d03a4d609c49f7da56d488da',
        updated_datetime: '2021-05-31T16:18:21.453Z',
        created_datetime: '2021-02-24T11:30:06.000Z',
        channel_name: 'twitter',
        channel_id: 'f5196e808ebf5cfdbe30af7a37ad4753',
      },
      connectivities: [
        {
          id: 6,
          disconnected_datetime: '2021-02-24T14:03:06.000Z',
          connected_datetime: '2021-02-24T11:30:06.000Z',
          uuid: '2f361f98b2f046258948f8c6d44e66d6',
          updated_datetime: '2021-02-24T14:03:06.000Z',
          created_datetime: '2021-02-24T11:30:06.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 14,
          disconnected_datetime: '2021-03-19T09:40:59.000Z',
          connected_datetime: '2021-02-24T18:33:49.000Z',
          uuid: '90a830bf6a2344f4b5268ff6846a50f0',
          updated_datetime: '2021-03-19T09:40:59.000Z',
          created_datetime: '2021-02-24T18:33:49.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 71,
          disconnected_datetime: '2021-04-13T17:15:23.000Z',
          connected_datetime: '2021-03-31T18:46:11.000Z',
          uuid: '6970ea82480745c483d6730d4d8b494f',
          updated_datetime: '2021-04-13T17:15:23.000Z',
          created_datetime: '2021-03-31T18:46:11.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 92,
          disconnected_datetime: '2021-05-06T14:12:27.914Z',
          connected_datetime: '2021-04-13T17:15:35.000Z',
          uuid: 'e1eb162caa9f4f9fb372cbd8b331f520',
          updated_datetime: '2021-05-06T14:12:27.882Z',
          created_datetime: '2021-04-13T17:15:35.000Z',
          disconnector_id: '0bc30144018211eb937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 106,
          disconnected_datetime: null,
          connected_datetime: '2021-05-22T10:55:29.840Z',
          uuid: '16e7a275396c561fbb088da0495d0512',
          updated_datetime: null,
          created_datetime: '2021-05-22T10:55:29.840Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
      ],
    },
  ],
};

export const Multiple = Template.bind({});
Multiple.args = {
  credentialsWithIssue: [
    {
      id: 6,
      status: 'phone_connection_lost',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '03f3795cf7ff4a509bfe35215fbc90c9',
      updated_datetime: '2021-05-22T10:55:29.820Z',
      created_datetime: '2021-02-24T11:30:06.000Z',
      user_id: '50b84359d03a4d609c49f7da56d488da',
      user: {
        id: 7,
        image_url: 'https://pbs.twimg.com/profile_images/1356896177195782150/ACtRF0pm_normal.jpg',
        email: null,
        platform_name: 'Simpu',
        platform_nick: 'SimpuHQ',
        uuid: '50b84359d03a4d609c49f7da56d488da',
        updated_datetime: '2021-05-31T16:18:21.453Z',
        created_datetime: '2021-02-24T11:30:06.000Z',
        channel_name: 'twitter',
        channel_id: 'f5196e808ebf5cfdbe30af7a37ad4753',
      },
      connectivities: [
        {
          id: 6,
          disconnected_datetime: '2021-02-24T14:03:06.000Z',
          connected_datetime: '2021-02-24T11:30:06.000Z',
          uuid: '2f361f98b2f046258948f8c6d44e66d6',
          updated_datetime: '2021-02-24T14:03:06.000Z',
          created_datetime: '2021-02-24T11:30:06.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 14,
          disconnected_datetime: '2021-03-19T09:40:59.000Z',
          connected_datetime: '2021-02-24T18:33:49.000Z',
          uuid: '90a830bf6a2344f4b5268ff6846a50f0',
          updated_datetime: '2021-03-19T09:40:59.000Z',
          created_datetime: '2021-02-24T18:33:49.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 71,
          disconnected_datetime: '2021-04-13T17:15:23.000Z',
          connected_datetime: '2021-03-31T18:46:11.000Z',
          uuid: '6970ea82480745c483d6730d4d8b494f',
          updated_datetime: '2021-04-13T17:15:23.000Z',
          created_datetime: '2021-03-31T18:46:11.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 92,
          disconnected_datetime: '2021-05-06T14:12:27.914Z',
          connected_datetime: '2021-04-13T17:15:35.000Z',
          uuid: 'e1eb162caa9f4f9fb372cbd8b331f520',
          updated_datetime: '2021-05-06T14:12:27.882Z',
          created_datetime: '2021-04-13T17:15:35.000Z',
          disconnector_id: '0bc30144018211eb937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
        {
          id: 106,
          disconnected_datetime: null,
          connected_datetime: '2021-05-22T10:55:29.840Z',
          uuid: '16e7a275396c561fbb088da0495d0512',
          updated_datetime: null,
          created_datetime: '2021-05-22T10:55:29.840Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '03f3795cf7ff4a509bfe35215fbc90c9',
        },
      ],
    },
    {
      id: 9,
      status: 'replaced',
      organisation_id: '5ab71f75e39f11ea937086d35ec4f76b',
      uuid: '35fd6c2a35e34c1dac7043f9f7babe8e',
      updated_datetime: '2021-06-05T14:27:58.913Z',
      created_datetime: '2021-02-24T13:52:32.000Z',
      user_id: '51af7febf45b479892df8f12a8ce6b11',
      user: {
        id: 10,
        image_url:
          'https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/p50x50/118332988_103690244797949_3267606031868162180_o.png?_nc_cat=110&ccb=3&_nc_sid=dbb9e7&_nc_eui2=AeHZuaKBrF7n35y2UjdcNs2Netmb-qXhRnN62Zv6peFGc61QdRukIWO1Ik_0qcxMDwt7mtUnSbY0vz0Ng9qlcZPp&_nc_ohc=39JzsVPNf3YAX__Q9EA&_nc_ht=scontent.xx&_nc_tp=30&oh=29940e1a6a41484f433d93a74a9bd2bc&oe=605C59C4',
        email: null,
        platform_name: 'The Fires of Heaven',
        platform_nick: null,
        uuid: '51af7febf45b479892df8f12a8ce6b11',
        updated_datetime: '2021-05-31T16:17:51.999Z',
        created_datetime: '2021-02-24T13:52:32.000Z',
        channel_name: 'messenger',
        channel_id: 'af84887e76d25148ba39fc2f7fbeb1b3',
      },
      connectivities: [
        {
          id: 10,
          disconnected_datetime: '2021-02-24T13:58:08.000Z',
          connected_datetime: '2021-02-24T13:52:32.000Z',
          uuid: '9ae7e476140b45299750ab966d832a0d',
          updated_datetime: '2021-02-24T13:58:08.000Z',
          created_datetime: '2021-02-24T13:52:32.000Z',
          disconnector_id: '5ab599aee39f11ea937086d35ec4f76b',
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '35fd6c2a35e34c1dac7043f9f7babe8e',
        },
        {
          id: 126,
          disconnected_datetime: null,
          connected_datetime: '2021-06-05T14:27:58.927Z',
          uuid: '5430aed286415540abeda61a2ef815ce',
          updated_datetime: null,
          created_datetime: '2021-06-05T14:27:58.927Z',
          disconnector_id: null,
          connector_id: '5ab599aee39f11ea937086d35ec4f76b',
          credential_id: '35fd6c2a35e34c1dac7043f9f7babe8e',
        },
      ],
    },
  ],
};
