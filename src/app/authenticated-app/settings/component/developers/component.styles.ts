import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core';

export const Wrapper = styled(Box)`
  display: flex;

  .side-bar {
    position: fixed;
    width: 260px;
    height: calc(100vh - 60px);
    padding: 50px 18px;
    margin-left: 6vw;

    @media (max-width: 1400px) {
      margin-left: 6vw;
    }
    @media (max-width: 1000px) {
      margin-left: 5vw;
    }
    @media (max-width: 800px) {
      margin-left: 2.5vw;
    }
    @media (max-width: 640px) {
      z-index: 2;
      width: 100%;
      height: auto;
      padding: 1rem;
      margin-left: 0;
      background-color: white;
      border-bottom: 1px solid #e2e8f0;
    }

    .search-section {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 25px;

      .action-section {
        display: flex;
        align-items: center;

        .btn-bg {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2px;
          border-radius: 5px;
          margin-left: 3px;
          cursor: pointer;
        }

        .active {
          background-color: #dedede;
        }
      }
    }

    .search-input {
      height: 30px;
      width: 83%;
      box-shadow: none;
      outline: none;
      font-size: 14px;
      line-height: 18px;
    }

    .option-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      // color: #4f4f4f;
      color: #6d7580;
      cursor: pointer;
      width: 100%;
    }

    .option-item:hover,
    .active {
      background-color: rgba(196, 196, 196, 0.22);
    }

    .option-item:hover,
    .option-item.active {
      background-color: rgba(196, 196, 196, 0.22);
    }

    .option-item.active .text {
      color: #3d43df;
    }

    .disabled {
      cursor: not-allowed;
      :hover {
        background-color: initial;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    width: calc(92vw - 260px);

    padding: 45px 20px;

    margin-left: calc(6vw + 260px);

    @media (max-width: 1400px) {
      margin-left: calc(6vw + 260px);
      width: calc(92vw - 260px);
    }

    @media (max-width: 1000px) {
      margin-left: calc(5vw + 260px);
      width: calc(90vw - 260px);
    }

    @media (max-width: 800px) {
      margin-left: calc(2.5vw + 260px);
      width: calc(95vw - 260px);
    }

    @media (max-width: 640px) {
      width: 100%;
      margin-left: 0;
      padding-top: 150px;
    }

    .section-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .title {
        font-size: 26px;
        font-weight: 600;
        color: #333333;
      }

      .inactive {
        color: #b0b0b0;
      }

      .upgrade-badge {
        border-radius: 5px;
        padding: 3px 5px;
        font-size: 12px;
        background-color: rgba(61, 66, 223, 0.1);
        color: rgb(61, 66, 223);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.1s ease-in;

        outline: none;

        :hover {
          transform: scale(1.02);
        }
      }
    }

    .section-toolbar {
      display: flex;
      width: 100%;
      align-items: center;
      flex-direction: row;
      justify-content: space-between;

      .status-options {
        display: flex;

        .item {
          padding: 7.5px 5px;
          font-size: 14px;
          margin-right: 15px;
          cursor: pointer;
          color: #333333;

          :hover {
            border-bottom: solid 3px #3d43df;
          }
        }

        .active {
          font-weight: 500;
          color: #3d43df;
          border-bottom: solid 3px #3d43df;
        }
      }

      .search-input {
        width: 175px;
        border-radius: 5px;
        color: #333333;
      }

      .date-range-display {
        color: #757575;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease-in;

        :hover {
          color: #333333;
        }
      }
      .date-range {
        color: #757575;
        font-size: 14px;
      }
    }

    .section-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
      margin-top: 15px;
    }
  }
`;
