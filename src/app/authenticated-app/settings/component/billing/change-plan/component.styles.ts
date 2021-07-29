import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core';

// noinspection CssUnknownTarget
export const Wrapper = styled.div`
  max-width: 900px;
  margin: auto;

  .section-stage-nav {
    margin: 30px auto;
    align-self: center;
    max-width: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #757575;
      font-weight: 500;
      transition: all 0.1s ease-in-out;
      opacity: 1;
      cursor: pointer;

      .icon-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 45px;
        width: 45px;
        border-radius: 25px;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        margin-bottom: 5px;
      }

      :hover {
        transform: scale(1.05);
      }
    }

    .active {
      color: #3525e6;
    }

    .disabled {
      cursor: not-allowed;
      opacity: 0.5;

      :hover {
        transform: none;
      }
    }
  }

  .section-plans {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 30px 0;
    margin-bottom: 40px;

    .plan-item {
      width: 265px;
      padding: 30px 30px 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 20px;
      background-color: white;
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

      .title {
        font-size: 25px;
        font-weight: 600;
        margin-bottom: 10px;
      }

      .description {
        text-align: center;
        color: #757575;
        font-weight: 400;
        font-size: 14px;
      }

      .pricing {
        display: flex;
        align-items: center;
        margin: 20px 0;

        .amount {
          font-size: 24px;
          font-weight: 500;
          margin-right: 10px;

          .currency {
            font-size: 12px;
            color: #757575;
            vertical-align: text-top;
            padding-right: 3px;
          }
        }

        .info {
          font-size: 12px;
          font-weight: 400;
          color: #757575;
        }
      }

      .feature-item {
        margin: 5px 0;
        width: 100%;
        font-size: 14px;
        align-items: center;
        display: flex;
        color: #757575;

        .icon {
          margin-right: 10px;
          margin-top: 5px;
          color: #3525e6;
        }
      }

      .bold {
        font-weight: 500;
        color: #333333;
      }
    }

    .blurred {
      background-color: #f8f8f8;
    }
  }

  .help-prompt-card {
    margin: 30px 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    padding: 25px 35px;
    background-color: rgba(53, 37, 230, 0.03);
    font-size: 14px;
    font-weight: 500;
  }
`;

export const CardItemWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.0334353);

  :hover {
    background-color: #fafafa;
    cursor: pointer;
  }

  .card-logo {
    height: 35px;
    width: auto;
    margin-right: 25px;
  }
  .text-primary {
    color: #333333;
    font-weight: 600;
    font-size: 16px;
    overflow: hidden;
    white-space: nowrap;
  }
  .text-secondary {
    font-weight: 400;
    font-size: 14px;
    color: rgba(17, 17, 17, 0.5);
    overflow: hidden;
    white-space: nowrap;
  }

  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 200px;

    * {
      margin: 0 10px;
    }
  }

  :nth-last-of-type(1) {
    border-bottom: none;
  }
`;
