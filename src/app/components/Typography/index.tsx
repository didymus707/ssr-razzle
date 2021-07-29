import React, { forwardRef } from 'react';
import {
  Heading as ChakraHeading,
  Text as ChakraText,
  HeadingProps,
  BoxProps,
} from '@chakra-ui/core';

export const Title = forwardRef((props: HeadingProps, ref: any) => (
  <ChakraHeading ref={ref} fontSize="4rem" fontWeight="bold" {...props} />
));

export const Heading2 = forwardRef((props: HeadingProps, ref: any) => (
  <ChakraHeading ref={ref} fontSize="2.5rem" fontWeight="bold" {...props} />
));

export const Heading3 = forwardRef((props: HeadingProps, ref: any) => (
  <ChakraHeading ref={ref} fontSize="1.5rem" fontWeight="bold" {...props} />
));

export const Subtitle = forwardRef((props: BoxProps, ref: any) => (
  <ChakraText ref={ref} lineHeight="21px" fontSize="1.5rem" fontWeight="bold" {...props} />
));

export const BodyText = forwardRef((props: BoxProps, ref: any) => (
  <ChakraText ref={ref} lineHeight="22px" fontSize="1rem" fontWeight="normal" {...props} />
));

export const SmallText = forwardRef((props: BoxProps, ref: any) => (
  <ChakraText ref={ref} lineHeight="21px" fontSize="0.875rem" fontWeight="normal" {...props} />
));

export const XSmallText = forwardRef((props: BoxProps, ref: any) => (
  <ChakraText ref={ref} lineHeight="21px" fontSize="0.75rem" fontWeight="normal" {...props} />
));

export const PreTitle = forwardRef((props: BoxProps, ref: any) => (
  <ChakraText
    ref={ref}
    lineHeight="21px"
    fontSize="0.75rem"
    fontWeight="bold"
    textTransform="uppercase"
    {...props}
  />
));
