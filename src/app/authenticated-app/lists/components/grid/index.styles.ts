// @ts-nocheck
import styled from '@emotion/styled';

export const ListGridWrapper = styled.div`
  #ListGrid {
    height: calc(100vh - 10.5rem);

    * {
      border: none;
      font-family: Averta;
    }

    .ag-header-viewport {
    }

    .ag-checkbox {
    }

    .ag-center-cols-viewport {
      overflow-x: ${props => (props.allowScroll ? 'auto' : 'hidden')};
    }

    .ag-body-viewport {
      overflow-y: ${props => (props.allowScroll ? 'auto' : 'hidden')};
    }

    .ag-header-cell-label {
      height: 100%;
      font-weight: 500;
      padding: 0 !important;
      border: none;
    }

    .ag-cell-label-container {
      height: 100%;
    }

    .ag-header-cell {
      border: solid #f2f2f2 1px;
      border-right: none;
      border-bottom: none;
      background-color: white;

      :hover {
        background-color: #fafafa;
      }
    }

    .ag-pinned-left-header {
      .ag-header-cell:nth-of-type(1) {
        border: 1px none #f2f2f2;
        border-top-style: solid;
      }

      .ag-header-cell:nth-of-type(2) {
        border-right: 4px solid rgba(243, 243, 243, 0.5);

        .ag-header-cell-resize:hover {
          right: -5px;
        }
      }
    }

    .ag-header-cell-resize:hover {
      right: -2px;
      padding: 2px;
      width: 1px;
      margin-top: 7.5px;
      height: 30px;
      background-color: #4242c1 !important;
      border-radius: 2px;
    }

    .ag-header-cell-resize::after {
      background-color: transparent !important;
    }

    .ag-cell {
      border: solid #f2f2f2 1px;
      border-top: none;
      border-right: none;
      background-color: white;
    }

    .ag-row-hover {
      .ag-cell {
        background-color: #fafafa;
      }
    }

    .ag-pinned-left-cols-container {
      .ag-cell:nth-of-type(1) {
        border: 1px none #f2f2f2;
        border-bottom-style: solid;

        .row-select-cell {
          display: flex;
          align-items: center;

          .row-select-checkbox,
          .row-expand-btn {
            display: none;
          }

          .row-expand-btn {
            background-color: rgba(61, 66, 223, 0.2);
          }

          .row-select-index {
            display: flex;
          }
        }

        :hover {
          .row-select-cell {
            .row-select-checkbox,
            .row-expand-btn {
              display: flex;
            }

            .row-select-index {
              display: none;
            }
          }
        }
      }

      .ag-cell:nth-of-type(2) {
        border-right: 4px solid rgba(243, 243, 243, 0.5);
      }
    }

    .ag-full-width-row {
      border-bottom: solid #f2f2f2 1px;
      background-color: white;
      display: flex;
      align-items: center;

      * {
        display: flex;
        flex-direction: row;
        align-items: center;

        border-left: none;

        :hover {
          background-color: #fafafa;
        }
      }

      & {
        padding: 0 22px;
      }

      :hover {
        background-color: #fafafa;
      }
    }

    .ag-horizontal-left-spacer,
    .ag-horizontal-right-spacer {
      display: none;
    }

    overflow-x: hidden;
    scroll-behavior: smooth;

    .ag-center-cols-viewport {
      ::-webkit-scrollbar {
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: #f5f5f5;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #ccc;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #999;
      }
    }
  }

  .footing {
    display: flex;
    height: 2.5rem;
    flex-direction: row;
    align-items: center;
    padding: 0 22px;
    border-top: 1px solid rgba(144, 164, 183, 0.22);
    font-size: 12px;
    line-height: 18px;
    color: rgba(33, 34, 66, 0.7);
  }
`;
