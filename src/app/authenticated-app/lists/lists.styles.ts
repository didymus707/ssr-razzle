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
      border-bottom: 1px solid #E2E8F0;
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
          background-color: rgba(196, 196, 196, 0.22);
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
`;
