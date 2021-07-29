import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core/dist';

// noinspection CssUnknownTarget
export const Wrapper = styled.div`
  .list-header {
    display: flex;
    align-items: center;
    padding: 1rem 1rem 0;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: 14px;

    div {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .toolbar {
      justify-content: normal;

      .list-badge {
        border-radius: 10px;
        padding: 2px 5px;
        margin: 0 15px;
        font-size: 10px;
        background-color: #3d43df;
        font-weight: 500;
        color: white;
        cursor: default;
      }

      .toolbar-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 5px 10px;
        color: #4f4f4f;
        cursor: pointer;
        transition: all 0.2s ease-in;
        font-size: 13px;
        line-height: 16px;
        border-radius: 5px;

        .icon {
          margin-right: 5px;
        }

        :hover {
          background-color: #f2f2f2;
        }
      }
    }

    .list-actions {
      display: none;
    }
    :hover,
    :focus,
    :focus-visible,
    :focus-within {
      .list-actions {
        display: flex;
        .icon-bg {
          background-color: #f2f2f2;
        }
      }
      .list-title-input {
        background-color: #fafafa;
        outline: none;
      }
    }

    .icon-bg {
      height: 26px;
      width: 26px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      border-radius: 13px;
      margin-right: 16px;
      cursor: pointer;
      transition: all 0.2s ease-in;

      :hover {
        background-color: #f2f2f2;
      }
    }

    .list-title {
      font-size: 1.125rem;
      font-weight: 500;
      color: #212121;
      margin-right: 18px;
    }

    .list-title-input {
      font-size: 1.125rem;
      font-weight: 600;
      color: #212121;

      padding: 5px;
      background-color: transparent;

      :focus,
      :hover {
        background-color: #fafafa;
        outline: none;
      }
    }
  }

  .list-content {
  }
`;

export const SelectOptionMenuWrapper = styled.div`
  padding: 10px 5px;
  display: flex;
  flex-direction: column !important;
  background: #ffffff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 10px 10px 0px;
  border: rgba(67, 90, 111, 0.1) solid 1px;
  border-radius: 5px;

  transition: all 0.2s ease-in;

  cursor: default;

  .input-item {
    padding: 7px 10px;
    font-size: 13px;
    line-height: 16px;
    width: 180px;

    input {
      padding: 5px 7.5px;
    }
  }

  hr {
    margin: 5px 0;
  }

  .list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    .color {
      width: 15px;
      height: 15px;
      margin-right: 10px;
      border-radius: 2px;
      border: 1px solid;
    }
  }

  .space-between {
    justify-content: space-between !important;
  }
`;

export const PopoverWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px 5px;

  background: #ffffff;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 10px 10px 0px;
  border: rgba(67, 90, 111, 0.1) solid 1px;
  border-radius: 5px;

  transition: all 0.2s ease-in;

  .input-item {
    padding: 7px 10px;
    font-size: 13px;
    line-height: 16px;
    width: 180px;

    input {
      padding: 5px 7.5px;
    }
  }

  .property-type-label {
    color: #828282;
    font-size: 11px;
    line-height: 14px;
    padding: 5px 10px;
  }

  .customization-description-text {
    padding: 7px 10px;
    font-size: 11px;
    line-height: 14px;
    color: #828282;
  }

  .property-type {
    padding: 6px 0;
  }

  hr {
    margin: 5px 0;
  }

  .list-item,
  .list-item-no-icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-start !important;

    align-items: center;
    min-width: 150px;
    padding: 7px 10px;

    font-size: 13px;
    line-height: 16px;

    .icon {
      margin-right: 10px;
    }

    :hover {
      background-color: #fafafa;
      cursor: pointer;
    }
  }

  .list-item-no-icon {
    justify-content: space-between !important;
  }

  .active {
    background-color: #fafafa;
  }

  .filter-container,
  .sort-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    align-items: flex-start !important;
    text-align: left;
    padding: 20px 20px 10px;

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

    .filter-item,
    .sort-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;
      width: 100%;

      .conjunction,
      .operand {
        font-size: 14px;
        width: 70px;
      }

      .selected-label-text {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .column-select,
      .conjunction-select,
      .sort-order-select {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #f6f6f6;
        border-radius: 5px;
        padding: 5px;
        width: 130px;
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

      .sort-slider {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #efefef;
        padding: 4px 3px;
        border-radius: 4px;

        .item {
          font-size: 12px;
          margin: 0 3px;
          padding: 1px 10px;
          cursor: pointer;
        }

        .active {
          color: white;
          border-radius: 3px;
          background-color: #6e6e6e;
        }
      }

      .conjunction-select {
        padding-left: 10px;
        width: 70px;
      }

      .sort-order-select {
        padding-left: 10px;
        width: 160px;

        .selected-label-text {
          width: 140px;
        }
      }

      .operator-select {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        background-color: #f6f6f6;
        border-radius: 5px;
        padding: 5px;
        width: 205px;
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
        width: 200px;
        height: fit-content;
        box-shadow: none;

        :focus {
          box-shadow: none;
          outline: none;
        }
      }

      .icon-menu {
        height: 26px;
        width: 26px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 13px;
        margin-right: 16px;
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

  .filter-create-container {
    display: flex;
    flex-direction: column;
    align-self: flex-start;
    align-items: flex-start !important;
    text-align: left;
    padding: 10px;

    .option-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      padding: 10px;

      transition: all 0.1s ease-in;

      :hover {
        cursor: pointer;
        background-color: #fafafa;
      }

      .icon {
        margin-right: 12px;
        margin-top: 2px;
        color: rgb(51, 51, 51);
      }

      .text {
        display: flex;
        flex-direction: column !important;
        align-self: flex-start;
        align-items: flex-start !important;
        text-align: left;

        * {
          font-size: 14px;
        }

        .label {
          color: rgb(51, 51, 51);
        }

        .description {
          color: #bdbdbd;
        }
      }
    }
  }

  .select-cell {
    display: flex !important;
    flex-direction: row;

    .value-item {
      margin-left: 5px;
      padding: 2px 5px;
      border-radius: 2px;
    }
  }

  .select-editor,
  .multiselect-editor {
    display: flex;
    flex-direction: column;

    min-width: 250px;

    .description-text {
      color: #8c8c8c;
      padding: 0 10px;
      font-size: 12px;
      font-weight: 500;
      margin-bottom: 5px;
    }

    .option-item {
      display: flex;
      flex-direction: row;
      font-size: 12px;
      padding: 4px 5px;
      width: 100%;
      cursor: pointer;
      align-items: center;
      justify-content: space-between;

      .left {
        align-items: center;
        display: flex;
        flex-direction: row;
      }

      .name {
        margin-left: 5px;
        padding: 2px 5px;
        border-radius: 2px;
      }

      .icon-bg {
        height: 26px;
        width: 26px;
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

      :hover {
        background-color: #fafafa;
      }
    }
  }

  .date-editor {
    width: 100%;
    display: flex;
    flex-direction: column;

    * {
      font-size: 13px !important;
    }

    .input-item {
      width: 100%;
    }

    * {
      outline: none;
    }
  }
`;
