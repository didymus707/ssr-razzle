import * as React from 'react';
import { Box, ModalBody, ModalFooter, Text, Image, Divider } from '@chakra-ui/core';
import { Link as NextLink } from 'react-router-dom';
import { ModalContainer, Button } from '../../../components';

interface WelcomeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  nextStep?: () => void;
}

export function WelcomeModal({ isOpen, onClose, nextStep }: WelcomeModalProps) {
  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <Box color="#212242" fontSize="0.9rem" lineHeight="1.3rem">
          <Image
            size="51px"
            rounded="full"
            marginTop="2rem"
            alt="User Avatar"
            marginBottom="0.5rem"
            src="https://bit.ly/2XKU6Yx"
            fallbackSrc="https://via.placeholder.com/150"
          />
          <Box marginTop="1.5rem">
            <Text>
              Welcome{' '}
              <span role="img" aria-label="hand wave">
                👋🏾
              </span>
            </Text>
            <Text marginTop="1.2rem" fontWeight="semibold" color="#212242">
              Thanks for signing up — your account’s ready to go!
            </Text>
          </Box>
          <Box marginTop="1.5rem">
            <Text>
              Our goal with Simpu is to help streamline all your business operations. From
              organizing your data, contacts & clients to communicating with them daily. Simpu will
              help you and your team stay focused in a friendly way.
            </Text>
          </Box>
          <Box marginTop="1.5rem">
            <Text>
              If you ever need a hand, please contact me directly at c@simpu.co or on Twitter at
              @ichuckee.
            </Text>
          </Box>
        </Box>
        <Box marginTop="1.5rem">
          <p>
            <span style={{ fontSize: '30px' }} role="img" aria-label="with love">
              ❤️
            </span>
          </p>
          <p>Collins</p>
        </Box>
        <Divider marginTop="1.5rem" marginBottom="0" />
      </ModalBody>
      <ModalFooter width="fit-content" margin="auto">
        <Button onClick={nextStep} variantColor="blue">
          <NextLink to="/s/onboarding">Let’s get you started!</NextLink>
        </Button>
      </ModalFooter>
    </ModalContainer>
  );
}
