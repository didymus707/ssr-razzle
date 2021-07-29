import styled from '@emotion/styled';

// noinspection CssUnknownTarget
export const Wrapper = styled.div`
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

      .action-section {
        display: flex;
        align-items: center;
        margin-left: 10px;

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
          background-color: rgba(196, 196, 196, 0.22);
        }
      }
    }

    .search-input {
      border-radius: 8px;
      height: 30px;
      width: -webkit-fill-available;
      box-shadow: none;
      outline: none;
      font-size: 14px;
      line-height: 18px;
      border: none;
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
      color: #4f4f4f;
      cursor: pointer;
    }

    .option-item:hover,
    .active {
      background-color: rgba(196, 196, 196, 0.22);
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    width: calc(70vw - 286px);

    color: white;
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

      .upgrade-badge {
        border-radius: 10px;
        padding: 2px 5px;
        font-size: 10px;
        background-color: #3d43df;
        font-weight: 500;
        color: white;
        cursor: pointer;
        transition: all 0.1s ease-in;

        outline: none;

        :hover {
          transform: scale(1.02);
        }
      }
    }

    .description {
      font-size: 14px;
      color: #333333;
    }

    .section-type {
      margin-top: 20px;

      .section-heading {
        color: #737373;
        margin-bottom: 20px;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        text-transform: uppercase;
        flex-direction: row;
        width: 100%;
        align-items: center;
      }

      .section-grid {
        color: #333333;

        .item {
          height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 10px;
          border: lightgrey 2px solid;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;

          .coming-soon {
            background-color: #e8f3f2;
            color: limegreen;
            font-size: 12px;
            margin-left: auto;
            text-align: right;
            padding: 0 5px;
            border-radius: 5px;
          }

          :hover {
            background-color: #fafafa;
          }
        }

        .disabled {
          opacity: 0.65;
          cursor: not-allowed;
          background-color: #e7e7e7 !important;
        }
      }
    }

    .section-resource-config {
      display: flex;
      flex-direction: row;

      .section-resource-config-form {
        max-width: 550px;
        color: #333333;

        .row {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          margin-bottom: 35px;

          .label {
            font-weight: 400;
            font-size: 14px;
            width: 140px;
            margin-top: 5px;
            margin-right: 15px;
            display: flex;
            align-items: flex-end;
            color: #737373;
          }

          .field {
            width: 100%;

            .description {
              color: #737373;
              font-size: 12px;
            }
          }
        }

        .section-info {
          font-size: 13px !important;
          display: flex;
          flex-direction: column;
          color: #333333;
          background-color: #f5f5f5;
          border-radius: 5px;
          padding: 10px;
          height: fit-content;

          .link {
            color: #5252ff;
            cursor: pointer;

            :hover {
              text-decoration: underline;
            }
          }
        }

        .section-actions {
          margin-top: 40px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;

          * {
            font-weight: 500;
          }
        }
      }

      .section-resource-config-info {
        font-size: 13px !important;
        margin-left: 35px;
        display: flex;
        flex-direction: column;
        color: #333333;
        background-color: #f5f5f5;
        border-radius: 5px;
        padding: 15px;
        height: fit-content;
        width: 100%;
        max-width: 250px;

        .description {
          font-size: 13px;
          color: #737373;
          font-weight: 400;
          margin-bottom: 10px;
        }

        .ip {
          font-weight: 500;
        }
      }
    }

    .list-item--grid,
    .add-button--grid {
      cursor: pointer;
      max-width: 75px;

      * {
        transition: all 0.2s ease-in;
      }

      .box {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        height: 80px;
        margin-bottom: 13px;

        img {
          height: 32px;
        }
      }

      .label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        line-height: 16px;
        text-align: center;
        color: #333333;
      }

      :hover {
        .box {
          transform: scale(1.02);
          box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
        }
      }

      .action-btn-bg {
        position: absolute;
        right: 8px;
        bottom: 8px;
        display: none;
        align-items: center;
        padding: 0px;
        border-radius: 5px;
        transition: all 0.2s ease-in-out;

        :hover {
          background-color: rgba(0, 0, 0, 0.3);
          opacity: 0.5;
        }
      }

      :hover {
        .action-btn-bg {
          display: flex;
        }
      }
    }

    .add-button--grid {
      .box {
        background-color: rgba(0, 0, 0, 0.1);
        color: #dbdbdb;
      }
    }

    .list-item--list,
    .add-button--list {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      padding: 6px 8px;
      border-radius: 10px;
      transition: all 0.2s ease-in-out;
      justify-content: space-between;

      .box {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        height: 45px;
        width: 45px;
        margin-right: 15px;

        img {
          height: 18px;
        }
      }

      .label {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
        text-align: center;
        color: #333333;
      }

      .action-btn-bg {
        display: none;
        align-items: center;
        padding: 0px;
        border-radius: 5px;
        background-color: #c3c3c3;
        transition: all 0.2s ease-in-out;

        :hover {
          background-color: #585858;
        }
      }

      :hover {
        background-color: #e9e9e9;

        .action-btn-bg {
          display: flex;
        }
      }
    }

    .active {
      background-color: #e9e9e9;

      .action-btn-bg {
        display: flex;
      }
    }

    .add-button--list {
      .box {
        background-color: rgba(196, 196, 196, 0.22);
      }
    }
  }

  .filter-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    width: 100%;

    * {
      color: #333333;
    }

    .conjunction,
    .operand {
      font-size: 14px;
      width: 100px;
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
      padding: 5px 10px;
      width: 180px;
      margin-right: 4px;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .selected-label-text {
        width: 200px;
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
      width: 100px;
    }

    .operator-select {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      background-color: #f6f6f6;
      border-radius: 5px;
      padding: 5px 10px;
      margin-right: 4px;
      width: 240px !important;
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
      padding: 5px 10px;
      width: 180px;
      height: fit-content;
      box-shadow: none;
      margin-right: 10px;

      :focus {
        box-shadow: none;
        outline: none;
      }
    }

    .icon-menu {
      height: 25px;
      width: 25px;
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
`;
