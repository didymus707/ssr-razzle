import { Box, Flex, Image, Link, Stack } from '@chakra-ui/core';
import { BodyText, PreTitle, Subtitle, Button } from 'app/components';
import React, { ReactNode, useMemo, useState } from 'react';
import { InboxSettingsPage } from './component';

export const InboxSettingsRules = () => {
  const [activeSection, setActiveSection] = useState(0);

  const onClick = (section: number) => {
    setActiveSection(section);
  };

  const sectionProps: { [key: number]: any } = {
    0: {
      image: '/images/inbox/company-rules.png',
      title: 'Apply rules company-wide',
      caption:
        'Save time and hassle by creating centralized rules that apply to every message across your company inbox',
    },
    1: {
      image: '/images/inbox/load-balancing.png',
      title: 'Balance your team’s workload',
      caption:
        "Set limits on teammate assignments so your team isn't overwhelmed and your customers receive faster replies.",
    },
    2: {
      image: '/images/inbox/load-balancing.png',
      title: 'Balance your team’s workload',
      caption:
        "Set limits on teammate assignments so your team isn't overwhelmed and your customers receive faster replies.",
    },
  };

  const { title, image, caption } = useMemo(() => sectionProps[activeSection], [
    activeSection,
    sectionProps,
  ]);

  return (
    <InboxSettingsPage title="Rules">
      <Stack spacing="3.5rem" isInline maxW="800px">
        <Stack>
          <TabLink isActive={activeSection === 0} onClick={() => onClick(0)}>
            Company rules
          </TabLink>
          <TabLink isActive={activeSection === 1} onClick={() => onClick(1)}>
            Rules Library
          </TabLink>
          <TabLink isActive={activeSection === 2} onClick={() => onClick(2)}>
            Load Balancing
          </TabLink>
        </Stack>
        <Box flex={1} pt="2rem" pl="1.5rem" rounded="4px" bg="rgba(240, 238, 253, 0.42)">
          <Stack isInline>
            <Box>
              <Flex
                mb="1rem"
                width="180px"
                px="0.75rem"
                bg="#E3B51E"
                rounded="100px"
                height="1.25rem"
                alignItems="center"
                justifyContent="center"
              >
                <PreTitle fontSize="0.625rem" color="white" fontWeight="normal">
                  Available with enterprise
                </PreTitle>
              </Flex>
              <Subtitle fontSize="1.125rem" pb="1rem" color="gray.900">
                {title}
              </Subtitle>
              <BodyText pb="2rem" color="gray.500">
                {caption}
              </BodyText>
              <Stack isInline alignItems="center">
                <Button size="sm" variantColor="blue">
                  Talk to an expert
                </Button>
                <Button size="sm" variant="outline" variantColor="blue">
                  Upgrade
                </Button>
              </Stack>
            </Box>
            <Box>
              <Image src={image} />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </InboxSettingsPage>
  );
};

type TabLinkProps = {
  onClick?(): void;
  isActive?: boolean;
  children?: ReactNode;
};

const TabLink = (props: TabLinkProps) => {
  const { onClick, isActive, children } = props;
  const styles = isActive ? { color: 'gray.900' } : { color: 'gray.400' };

  return (
    <Link
      {...styles}
      pb="1.25rem"
      onClick={onClick}
      fontWeight="bold"
      fontSize="0.75rem"
      _hover={{
        textDecoration: 'none',
      }}
      textTransform="uppercase"
    >
      {children}
    </Link>
  );
};
