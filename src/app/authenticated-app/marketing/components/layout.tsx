import { Box } from '@chakra-ui/core';
import styled from '@emotion/styled';

// noinspection CssUnknownTarget
export const MarketingLayout = styled.div`
  display: flex;

  .side-bar {
    position: fixed;
    width: 286px;
    height: calc(100vh - 60px);
    padding: 50px 18px;
    margin-left: 15vw;

    @media (max-width: 1400px) {
      margin-left: 10vw;
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
    }

    .search-input {
      height: 30px;
      width: 83%;
      box-shadow: none;
      outline: none;
      font-size: 14px;
      line-height: 18px;
      background-color: rgba(196, 196, 196, 0.22);
    }

    .option-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 10px 0;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
    }

    .option-item:hover,
    .option-item.active {
      background-color: rgba(196, 196, 196, 0.22);
    }

    .option-item .navlink-container {
      color: #6d7580;
    }

    .option-item.active .navlink-container {
      color: #3d43df;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    width: calc(70vw - 286px);

    padding: 45px 20px;

    margin-left: calc(15vw + 286px);
    margin-bottom: 100px;

    @media (max-width: 1400px) {
      margin-left: calc(10vw + 286px);
      width: calc(80vw - 286px);
    }

    @media (max-width: 1000px) {
      margin-left: calc(5vw + 286px);
      width: calc(90vw - 286px);
    }

    @media (max-width: 640px) {
      width: 100%;
      margin-left: 0;
      padding-top: 380px;
    }

    .section-title {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
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
    }

    .active {
      background-color: #e9e9e9;

      .action-btn-bg {
        display: flex;
      }
    }
  }
`;

export const DashboardTableLayout = styled.table`
  width: 100%;

  th {
    color: #4f4f4f;
    font-size: 12px;
    font-weight: 500;
    text-align: start;
    padding: 12px 24px;
    text-transform: uppercase;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    color: #4f4f4f;
    font-size: 14px;
    font-weight: 500;
    padding: 16px 24px;
    border-bottom: 1px solid #e2e8f0;
  }

  tbody tr:last-of-type td {
    border-bottom: none;
  }
`;

export const CouponFilterWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 4px 0;

  transition: all 0.2s ease-in;

  .filter-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    align-items: flex-start !important;
    text-align: left;

    .title {
      color: #828282;
      font-size: 14px;
      line-height: 22.4px;
      margin-bottom: 16px;
    }

    .description-copy {
      font-size: 14px;
      line-height: 22.4px;
      color: #bdbdbd;
      margin-bottom: 16px;
    }

    .filter-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      width: 100%;

      .conjunction,
      .operand {
        font-size: 14px;
        width: 50px;
        margin-right: 4px;
      }

      .selected-label-text {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .column-select,
      .conjunction-select {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #f6f6f6;
        border-radius: 5px;
        padding: 5px;
        width: 120px;
        margin-right: 4px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .selected-label-text {
          width: 80px;
        }

        :hover {
          cursor: pointer;
        }

        * {
          font-size: 14px;
        }

        .icon {
          margin-right: 10px;
        }
      }

      .conjunction-select {
        padding-left: 10px;
        width: 50px;
      }

      .operator-select {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #f6f6f6;
        border-radius: 5px;
        padding: 5px;
        margin-right: 4px;
        width: 120px !important;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        :hover {
          cursor: pointer;
        }

        * {
          font-size: 14px;
        }
      }

      .value-input {
        background-color: #f6f6f6;
        font-size: 14px;
        padding: 5px;
        width: 100px;
        height: fit-content;
        box-shadow: none;
        margin-right: 4px;

        :focus {
          box-shadow: none;
          outline: none;
        }
      }

      .icon-menu {
        height: 20px;
        width: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 13px;
        cursor: pointer;
        transition: all 0.2s ease-in;

        :hover {
          background-color: #f2f2f2;
        }
      }

      * {
        font-size: 16px;
      }
    }

    .add-button {
      display: flex;
      flex-direction: row;
      color: rgb(61, 67, 223);
      padding: 5px 0;
      transition: all 0.1s ease-in;
      font-size: 14px;
      line-height: 22.4px;
      align-items: center;

      :hover {
        cursor: pointer;
      }

      :focus {
        outline: none;
        box-shadow: none;
      }

      .icon {
        margin-right: 10px;
      }
    }

    .disabled {
      color: gray;

      :hover {
        cursor: not-allowed;
      }
    }
  }
`;
