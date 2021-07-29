import {
  Box,
  BoxProps,
  ButtonProps,
  Divider,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
} from '@chakra-ui/core';
import { Button } from 'app/components';
import styled from '@emotion/styled';
import React from 'react';
import phoneImage from '../../assets/screen-1.svg';

export type SectionHeaderProps = {
  heading: string;
  subheading: string;
} & BoxProps;

export interface FlowStepProps {
  label: string;
  count: number;
  isActive?: boolean;
  isComplete?: boolean;
}

export type SectionFooterProps = {
  onGoBack(): void;
  onContinue(): void;
  goBackLabel: string;
  continueLabel: string;
  buttonWidth?: ButtonProps['width'];
  actionButtonType?: 'submit' | 'button';
} & BoxProps;

export const SectionContainer = styled(Box)`
  margin: 0 auto;
  max-width: 940px;
  padding-bottom: 4rem;

  .content {
    display: flex;
    justify-content: space-between;

    .left-section {
      width: 50%;
    }

    .right-section {
      width: 30%;
    }

    .editable {
      padding: 0;
      border: none;

      &:focus {
        border: none;
        box-shadow: none;
      }

      &:hover {
        border: none;
        box-shadow: none;
      }
    }
  }
`;

export const SectionHeader = ({ heading, subheading, ...rest }: SectionHeaderProps) => {
  return (
    <Box maxWidth="480px" {...rest}>
      <Heading as="h4" pb="0.2rem" fontSize="1.2rem" fontWeight={600} color="black">
        {heading}
      </Heading>
      <Text color="gray.600" fontSize="0.875rem">
        {subheading}
      </Text>
    </Box>
  );
};

export const SectionFooter = ({
  onGoBack,
  onContinue,
  goBackLabel,
  continueLabel,
  actionButtonType = 'button',
  buttonWidth = ['auto', 'auto', '50%'],
  ...rest
}: SectionFooterProps) => {
  return (
    <Stack
      flex={1}
      isInline
      alignItems="center"
      mt="2rem"
      py="1rem"
      borderTopWidth="1px"
      justifyContent="flex-end"
      {...rest}
    >
      <Button size="sm" onClick={onGoBack} width={buttonWidth} type="button">
        {goBackLabel}
      </Button>
      <Button
        size="sm"
        onClick={onContinue}
        variantColor="blue"
        width={buttonWidth}
        type={actionButtonType}
      >
        {continueLabel}
      </Button>
    </Stack>
  );
};

export const PhoneContainer = ({ children }: { children?: React.ReactNode }) => (
  <Box width="100%" height="100%" position="relative">
    <Image src={phoneImage} />
    <Box
      top="14px"
      bg="white"
      left="16px"
      borderRadius="32px"
      position="absolute"
      width="calc(100% - 32px)"
      height={['45%', '90%', '95%']}
    >
      <Flex
        pt="1rem"
        bg="white"
        pb="0.8rem"
        px="0.8rem"
        width="100%"
        height="100%"
        borderRadius="28px"
        flexDirection="column"
      >
        <Flex mb="2rem" alignItems="center" flexDirection="column" justifyContent="center">
          <Box mb="0.5rem" bg="#f1f1f1" width="25px" height="25px" borderRadius="50%" />
          <Box bg="#f1f1f1" height="0.5rem" width="50px" />
        </Flex>
        {children}
      </Flex>
    </Box>
  </Box>
);

export const FlowStep = ({ count, label, isActive, isComplete }: FlowStepProps) => {
  const style = isActive
    ? {
        bg: 'primary',
        color: 'white',
      }
    : {
        bg: 'transparent',
        color: 'primary',
      };
  return (
    <Stack isInline alignItems="center">
      {isComplete ? (
        <Icon name="check" color="primary" size="1rem" />
      ) : (
        <Flex
          w="20px"
          height="20px"
          fontWeight={600}
          borderWidth="1px"
          borderRadius="50%"
          fontSize="0.75rem"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          borderColor="primary"
          {...style}
        >
          {count}
        </Flex>
      )}
      <Text fontWeight={500} fontSize="0.875rem">
        {label}
      </Text>
    </Stack>
  );
};

export const FlowSteps = ({
  sections,
  activeSection,
}: {
  sections?: {
    count: number;
    label: string;
  }[];
  activeSection: number;
}) => {
  sections = sections ?? [
    { count: 0, label: 'Setup' },
    { count: 1, label: 'Design' },
    { count: 2, label: 'Review & send' },
  ];
  return (
    <Stack isInline alignItems="center">
      {sections.map(({ count, label }, index) => {
        const sectionsLength = sections?.length ? sections.length - 1 : 0;
        return (
          <Stack isInline alignItems="center" key={`${label}-${index}`}>
            <Box>
              <FlowStep
                label={label}
                count={count + 1}
                key={`${label}-${index}`}
                isActive={activeSection === count}
                isComplete={activeSection > count}
              />
            </Box>
            {index < sectionsLength && <Divider width="100px" />}
          </Stack>
        );
      })}
    </Stack>
  );
};
