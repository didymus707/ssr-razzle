import { Box, BoxProps, Flex, Heading, HeadingProps, Icon, Image } from '@chakra-ui/core';
import React from 'react';
import { SmallText } from '../Typography';

export type EmptyStateProps = BoxProps & {
  icon?: any;
  image?: string;
  height?: string;
  iconColor?: string;
  heading?: string;
  iconSize?: string;
  imageSize?: string;
  subheading?: string | React.ReactNode;
  width?: BoxProps['width'];
  subheadingProps?: BoxProps;
  children?: React.ReactNode;
  headingProps?: HeadingProps;
  imageContainerProp?: BoxProps;
  contentContainerProps?: BoxProps;
};

export function EmptyState({
  icon,
  width,
  image,
  heading,
  iconSize,
  children,
  iconColor,
  imageSize,
  subheading,
  headingProps,
  subheadingProps,
  imageContainerProp,
  contentContainerProps,
  height = '100%',
  ...rest
}: EmptyStateProps) {
  return (
    <Flex
      height={height}
      padding="0 1rem"
      textAlign="center"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      {...rest}
    >
      {image && (
        <Box width={imageSize} {...imageContainerProp}>
          <Image src={image} alt="" maxWidth="100%" />
        </Box>
      )}
      {icon && (
        <Box paddingBottom="2rem">
          <Icon name={icon} size={iconSize} color={iconColor} />
        </Box>
      )}
      <Box maxWidth={width} marginX="auto" {...contentContainerProps}>
        {heading && (
          <Heading
            size="md"
            color="#212242"
            fontWeight={500}
            marginBottom="0.5rem"
            {...headingProps}
          >
            {heading}
          </Heading>
        )}
        {subheading && (
          <SmallText
            opacity={0.5}
            color="#212242"
            fontSize="0.875rem"
            marginBottom="1rem"
            {...subheadingProps}
          >
            {subheading}
          </SmallText>
        )}
      </Box>
      {children}
    </Flex>
  );
}
