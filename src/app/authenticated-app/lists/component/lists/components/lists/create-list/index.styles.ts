import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core/dist';

export const CreateListWrapper = styled(Box)`
  color: #333333;

  .description {
    font-size: 14px;
    color: #757575;
  }

  .section {
    margin: 5px 0 20px;

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5px;
      width: 100%;

      .title-text {
        width: 30%;
        display: flex;
        flex-direction: row;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
    }

    .description {
      font-weight: 400;
      color: #757575;
      margin: 5px 0 20px;
      font-size: 14px;
    }
  }

  .create-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 10px;
    border-radius: 8px;
    border: 2px lightgrey solid;
    cursor: pointer;

    :hover {
      background-color: #fafafa;
    }

    .icon {
      margin-right: 5px;
    }

    .text {
      font-size: 14px;
    }

    .coming-soon {
      color: limegreen;
      font-size: 12px;
      margin-left: auto;
      text-align: right;
    }
  }

  .disabled {
    cursor: not-allowed;
    background-color: #e7e7e7 !important;
  }

  .file-name {
    display: flex;
    align-items: center;
    font-weight: 400;
    color: #333333;
    text-decoration: underline;
    margin-left: 30px;
  }
`;
