import styled from '@emotion/styled';
import { ModalContent } from '@chakra-ui/core';

export const CompletePaymentSetupDialogWrapper = styled(ModalContent)`
  border-radius: 10px;
  padding: 30px;
  margin-top: 20vw;

  .heading {
    font-weight: 600;
    color: #333333;
    font-size: 20px;
  }

  .prompt-text {
    color: #757575;
    margin: 20px 0;
    font-size: 14px;
  }
`;
