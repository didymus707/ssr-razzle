import styled from '@emotion/styled';
import { Box } from '@chakra-ui/core';

export const DashboardHeaderWrapper = styled(Box)`
  width: 100%;
  z-index: 2;
  position: fixed;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #3d43df;
  padding: 0 1.875rem;
  justify-content: space-between;
  color: white;

  @media (max-width: 767px) {
    display: none;
  }

  .simpu-logo {
    height: 28px;
    cursor: pointer;
  }

  .section {
    display: flex;
    flex-direction: row;
    align-items: center;

    .nav-items {
      margin-left: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;

      * {
        text-decoration: none;
        outline: none;
        box-shadow: none;
      }

      .item {
        font-size: 16px;
        font-weight: 500;
        margin: 0 10px;
        color: rgb(137, 137, 253);
        transition: all 0.2s ease-in;

        :hover {
          transform: scale(1.01);
          cursor: pointer;
          color: #ffffff;
        }
      }

      .active {
        color: #ffffff;
      }
    }
  }
`;
