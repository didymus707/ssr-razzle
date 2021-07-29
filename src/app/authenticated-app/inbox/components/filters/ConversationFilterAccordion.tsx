import {
  Accordion,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Icon,
  PseudoBox,
  PseudoBoxProps,
  Stack,
} from '@chakra-ui/core';
import { BodyText, Heading3 } from 'app/components';
import React, { ReactNode } from 'react';

export type ConversationFilterAccordionProps = {
  title: string;
  addons?: ReactNode;
  children: ReactNode;
  defaultIndex?: number[];
};

export const ConversationFilterAccordion = (props: ConversationFilterAccordionProps) => {
  const { title, children, addons, defaultIndex = [0] } = props;
  return (
    <Accordion position="relative" defaultIndex={defaultIndex} allowMultiple>
      <AccordionItem
        borderTopWidth="0"
        borderBottomWidth="0"
        _last={{
          borderBottomWidth: '0',
        }}
      >
        {({ isExpanded }) => (
          <>
            <AccordionHeader px="0" _hover={{ bg: 'transparent' }} _focus={{ boxShadow: 'none' }}>
              <Flex width="100%" alignItems="center" justifyContent="space-between">
                <Stack isInline alignItems="center" flex={1}>
                  <AccordionIcon name={isExpanded ? 'chevron-up' : 'chevron-right'} />
                  <Heading3 fontSize="1.25rem">{title}</Heading3>
                </Stack>
                <Stack isInline alignItems="center">
                  {addons}
                </Stack>
              </Flex>
            </AccordionHeader>
            <AccordionPanel px="0" borderColor="transparent" borderBottomWidth="0" pb={4}>
              {children}
            </AccordionPanel>
          </>
        )}
      </AccordionItem>
    </Accordion>
  );
};

export type ConversationFilterAccordionItemProps = {
  icon?: string;
  label: string;
  isActive?: boolean;
  iconColor?: string;
  children: ReactNode;
  onClick?(label: string): void;
  rightSection?: ({ isActive }: { isActive?: boolean }) => ReactNode | ReactNode;
} & Omit<PseudoBoxProps, 'onClick'>;

export const ConversationFilterAccordionItem = (props: ConversationFilterAccordionItemProps) => {
  const { children, icon, label, iconColor, onClick, isActive, rightSection } = props;
  const styles = isActive
    ? { bg: 'gray.200', color: 'blue.500' }
    : { bg: 'transparent', color: 'gray.600' };

  const handleClick = () => {
    onClick?.(label);
  };

  return (
    <PseudoBox
      px="1rem"
      height="40px"
      rounded="50px"
      bg={styles.bg}
      display="flex"
      cursor="pointer"
      alignItems="center"
      onClick={handleClick}
      justifyContent="space-between"
      _hover={isActive ? { bg: 'gray.200' } : { bg: 'gray.100' }}
    >
      <Stack isInline alignItems="center">
        <Icon size="1.5rem" name={icon} color={iconColor ?? styles.color} />
        <BodyText color={styles.color}>{children}</BodyText>
      </Stack>
      {typeof rightSection === 'function' ? rightSection({ isActive }) : rightSection}
    </PseudoBox>
  );
};
