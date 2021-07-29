//@ts-nocheck
import {
  BodyText,
  Heading2,
  Heading3,
  SmallText,
  Subtitle as SimpuSubtitle,
  Title as SimpuTitle,
  XSmallText,
} from '@app/components';
import { BoxProps, HeadingProps } from '@chakra-ui/core';
import { Meta } from '@storybook/react';
import React from 'react';

export default {
  title: 'Design System/Typography',
} as Meta;

export const Title = (args: HeadingProps) => <SimpuTitle {...args}>Title</SimpuTitle>;

export const Header2 = (args: HeadingProps) => <Heading2 {...args}>Heading 2</Heading2>;

export const Header3 = (args: HeadingProps) => <Heading3 {...args}>Heading 3</Heading3>;

export const Subtitle = (args: HeadingProps) => <SimpuSubtitle {...args}>Subtitle</SimpuSubtitle>;

export const Text = (args: BoxProps) => <BodyText {...args}>Text</BodyText>;

export const SText = (args: BoxProps) => <SmallText {...args}>Small Text</SmallText>;

export const XSText = (args: BoxProps) => <XSmallText {...args}>Extra Small Text</XSmallText>;
