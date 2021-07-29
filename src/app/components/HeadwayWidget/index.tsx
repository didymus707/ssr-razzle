import React, { useEffect, useState } from 'react';
import { HeadwayWidgetContainer } from './style';
import { Icon } from '@chakra-ui/core';
import { Box } from '@chakra-ui/core/dist';
// @ts-ignore
export const HeadwayWidget = () => {
  const [unseenCount, setUnseenCount] = useState(0);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.headwayapp.co/widget.js';
    document.head.appendChild(script);
    const config = {
      selector: '#headway-badge',
      account: 'JAR69y',
      trigger: '#HW_trigger',
      callbacks: {
        onWidgetReady: (widget: any) => {
          setUnseenCount(widget.getUnseenCount());
        },
      },
    };
    script.onload = function () {
      // @ts-ignore
      window.Headway.init(config);
    };
  }, []);

  return (
    <HeadwayWidgetContainer className="headway-badge" id="headway-badge">
      <Box id="HW_badge_cont">
        <Box id="HW_trigger" display="flex" flexDirection="row" alignItems="center">
          <Icon name="premium" size="14px" color={unseenCount > 0 ? '#ffff00' : '#ffffff'} />
        </Box>
      </Box>
    </HeadwayWidgetContainer>
  );
};
