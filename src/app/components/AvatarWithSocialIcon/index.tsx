import React from 'react';
import { Box, Avatar, AvatarProps, BoxProps } from '@chakra-ui/core';
import { SocialIcon, SocialIconProps } from '../SocialIcon';

export type AvatarWithSocialIconProps = {
  src: AvatarProps['src'];
  name: AvatarProps['name'];
  sWhich: SocialIconProps['which'];
  sSize: SocialIconProps['size'];
} & BoxProps;

export function AvatarWithSocialIcon({
  src,
  name,
  sWhich,
  sSize,
  ...rest
}: AvatarWithSocialIconProps) {
  return (
    <Box position="relative" {...rest}>
      <Avatar
        name={name}
        src={src}
        height="1.875rem"
        width="1.875rem"
        fontSize="calc(1.875rem / 2.5)"
      />

      <Box
        position="absolute"
        top=".75rem"
        right="-0.4375rem"
        boxShadow="0 9px 35px 4px rgba(0, 0, 0, 0.03)"
      >
        <SocialIcon which={sWhich} size={sSize} />
      </Box>
    </Box>
  );
}
