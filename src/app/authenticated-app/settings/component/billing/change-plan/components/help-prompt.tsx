import React from 'react';
import { Box, Image } from '@chakra-ui/core/dist';
import { Button } from 'app/components';

export const HelpPrompt = () => {
  return (
    <Box className="help-prompt-card">
      <Box display="flex" alignItems="center">
        <Image
          size="30px"
          rounded="full"
          alt="Support Avatar"
          marginRight="0.5rem"
          src="https://bit.ly/2XKU6Yx"
          fallbackSrc="https://via.placeholder.com/150"
        />
        <span style={{ fontWeight: 600, marginRight: 3.5 }}>Need help?</span>
        <span style={{ fontWeight: 400 }}>
          Talk to an expert and get the best plan for your team
        </span>
      </Box>
      <Button
        variant="link"
        variantColor="blue"
        onClick={() => {
          window.location.href = 'mailto:info@simpu.co';
        }}
      >
        Contact us
      </Button>
    </Box>
  );
};
