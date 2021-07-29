import { Icon } from '@chakra-ui/core';
import React from 'react';

const getIcon = (which: string): string => {
  switch (which) {
    case 'twitter':
      return 'inbox-twitter';
    case 'whatsapp':
    case 'whatsappWeb':
      return 'inbox-whatsapp';
    case 'messenger':
      return 'inbox-messenger';
    case 'sms':
    case 'phone':
      return 'inbox-sms';
    case 'email':
      return 'inbox-mail';
    case 'instagram':
      return 'instagramIcon';
    case 'voice':
      return 'phone';
    case 'ios':
      return 'iosIcon';
    case 'android':
      return 'androidIcon';
    case 'web-chat':
      return 'webChatIcon';
    default:
      return 'webChatIcon';
  }
};

export interface SocialIconProps {
  which: string;
  size?: string;
}

export const SocialIcon = ({ which, size }: SocialIconProps) => (
  <Icon color="gray.500" size={size || '2rem'} name={getIcon(which)} />
);
