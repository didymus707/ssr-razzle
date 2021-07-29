import { BoxProps, LinkProps } from '@chakra-ui/core';
import { unescape } from 'lodash';
import React from 'react';
import { SmallText } from '../Typography';

const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

const parseText = (text: string, linkProps?: LinkProps) => {
  return text.replace(urlRegex, function (url) {
    return (
      '<a target="_blank" href="' +
      url +
      '" style="font-weight: 400; text-decoration-line: underline;">' +
      url +
      '</a>'
    );
  });
};

export function getTextLinks(text: string) {
  return text.match(urlRegex) || [];
}

export function TextWithLink({
  text,
  linkProps,
  ...rest
}: {
  text: string;
  linkProps?: LinkProps;
} & BoxProps) {
  return (
    <SmallText
      dangerouslySetInnerHTML={{ __html: unescape(parseText(text, linkProps)) }}
      {...rest}
    />
  );
}
