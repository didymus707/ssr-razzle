import React from 'react';
import { ChannelsComponents } from './channels.component';
import { channelData } from './channels.data';
import { ChannelProps } from './channels.types';

export function Channels(props: ChannelProps) {
  return <ChannelsComponents metaData={channelData} {...props} />
}
