import { Box, Flex, Heading, Text } from '@chakra-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../../../components/Logo';
import { AuthLayoutContainer } from './AuthLayout.style';

export interface AuthLayoutProps {
  heading?: string;
  subheading?: string;
  children: React.ReactNode;
  footing?: React.ReactNode;
}

export function AuthLayout({ heading, subheading, children, footing }: AuthLayoutProps) {
  return (
    <AuthLayoutContainer>
      <Box
        height="100%"
        position="relative"
        display="flex"
        maxW="1100px"
        mx="auto"
        mb="0"
        alignItems="center"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex alignItems="center" justifyContent="center" mb="16px">
          <Logo width="100px" />
        </Flex>

        <Flex>
          <Box className="auth-hero">
            <img src="/images/auth-hero.png" alt="Auth hero" />
          </Box>
          <Box margin={['1rem', '1rem', '80px']} width={['auto', 'auto', '520px']}>
            <Box
              mb="30px"
              py="40px"
              position="relative"
              paddingBottom="45px"
              borderRadius="4px"
              backgroundColor="white"
              px={['1rem', '1rem', '40px']}
              boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            >
              <Box
                display="flex"
                marginBottom="20px"
                flexDirection="column"
                justifyContent="center"
              >
                <Box marginBottom="16px">
                  <Heading
                    size="xl"
                    fontSize="32px"
                    fontFamily="Averta"
                    paddingBottom="8px"
                    fontWeight="500"
                    color="#333333"
                  >
                    {heading}
                  </Heading>
                  <Text fontSize="18px" fontWeight="400" color="rgba(0,0,0,0.5)">
                    {subheading}
                  </Text>
                </Box>
              </Box>
              {children}
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
              {footing}
            </Box>
          </Box>
        </Flex>
        <Flex py="50px">
          <Text mx="15px">© Simpu</Text>
          <Link to="/terms-conditions">
            <Text mx="15px">Privacy & Terms</Text>
          </Link>
          <Link to="#">
            <Text mx="15px">Contact Us</Text>
          </Link>
        </Flex>
      </Box>
    </AuthLayoutContainer>
  );
}
