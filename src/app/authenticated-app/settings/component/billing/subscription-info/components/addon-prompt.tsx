import React from 'react';
import { Box } from '@chakra-ui/core/dist';

export const AddonPrompt = () => {
  return (
    <Box className="addon-prompt-card">
      <Box>
        <span role="img" aria-label="launch-emoji" style={{ marginRight: 5 }}>
          🚀
        </span>
        Need more team inbox channels, integrations, or analytics?
      </Box>
    </Box>
  );
};
