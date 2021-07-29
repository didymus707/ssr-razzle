import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core/dist';

export const HeadwayWidgetContainer = styled(Box)`
  position: absolute;
  display: flex;
  padding: 10px;
  bottom: 3px;
  right: 65px;

  * {
    font-size: 12px;
  }

  #HW_trigger {
    cursor: pointer;
    :hover {
      //text-decoration: underline;
    }
  }

  #HW_badge_cont {
    align-self: center;
  }

  #HW_badge {
    display: none;
  }
`;
