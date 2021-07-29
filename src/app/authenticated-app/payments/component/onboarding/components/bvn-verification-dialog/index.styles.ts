import styled from '@emotion/styled';
import { ModalContent } from '@chakra-ui/core';

export const BVNVerificationDialogWrapper = styled(ModalContent)`
  border-radius: 10px;
  padding: 35px;
  margin-top: 20vh;

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
