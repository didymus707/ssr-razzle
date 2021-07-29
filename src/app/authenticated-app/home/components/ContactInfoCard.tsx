import * as React from 'react';
import { Box, Flex, Image, Link, Text } from '@chakra-ui/core';
import { HomeCard } from './HomeCard';

export function ContactInfoCard() {
  return (
    <HomeCard>
      <Flex
        margin="0"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box paddingBottom={['0.5rem', '0.5rem', '0', '0']}>
          <Flex width="fit-content" fontSize="0.9rem">
            <Image
              size="51px"
              rounded="full"
              alt="User Avatar"
              marginRight="0.5rem"
              src="https://bit.ly/2XKU6Yx"
              fallbackSrc="https://via.placeholder.com/150"
            />
            <Box>
              <Text marginBottom="0.3rem" color="#212242">
                Got questions? Talk to us.
              </Text>
              <Text>
                <Link
                  isExternal
                  color="blue.300"
                  fontWeight="medium"
                  href="https://twitter.com/SimpuHQ"
                >
                  @simpu on Twitter
                </Link>
              </Text>
            </Box>
          </Flex>
        </Box>

        <Flex
          color="lightBlack"
          fontSize="0.8rem"
          flexDirection="column"
          paddingBottom={['0.5rem', '0.5rem', '0', '0']}
        >
          <Link marginBottom="0.3rem" textDecoration="underline" href="https://simpu.co/#faq-section" target="_blank">
            Frequently Asked Questions
          </Link>
          {/* <Link textDecoration="underline">Watch the overview video</Link> */}
        </Flex>
      </Flex>
    </HomeCard>
  );
}
