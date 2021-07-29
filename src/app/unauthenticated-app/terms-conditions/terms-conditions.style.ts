import styled from "@emotion/styled";

export const TermsConditionsContainer = styled.div`
  min-height: 100vh;
  padding-left: 10vw;
  padding-right: 10vw;
  display: flex;
  min-width: 1024px;

  @media (max-width: 1440px) {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  #sidenav {
    height: 100vh;
    position: fixed;
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: solid 1px rgba(201, 201, 201, 0.5);

    * {
      text-align: left;
    }

    .heading {
      padding: 1.5rem;
      display: flex;
    }

    .nav_list {
      padding: 1rem;
      font-weight: 500;

      .item {
        margin-top: 15px;
        margin-bottom: 15px;
        color: #3c4257;
        font-weight: 500;
        list-style: none;

        :hover {
          cursor: pointer;
          color: #3d50df;
        }
      }
    }

    .footer {
      padding: 1rem;
      border-top: solid 1px rgba(201, 201, 201, 0.5);
    }
  }

  #main {
    width: 100%;
    min-height: 100vh;
    margin-left: 250px;

    .top_nav {
      display: flex;
      padding-top: 1rem;
      padding-bottom: 1rem;
      width: 100%;
      justify-content: flex-end;
      list-style: none;
      border-bottom: solid 1px rgba(201, 201, 201, 0.5);

      .item {
        margin-left: 2rem;
        font-weight: 500;

        :hover {
          cursor: pointer;
          color: #3d50df;
        }
      }
    }

    .wrapper {
      width: 100%;
      padding-top: 30px;
      min-height: calc(100vh - 57px);
      display: flex;
      flex-direction: column;

      .page_nav {
        width: 200px;
        padding: 10px;
        position: fixed;
        align-self: flex-end;

        .heading {
          font-size: 0.8125rem;
          color: #697386;
          letter-spacing: -0.08px;
          text-transform: uppercase;
          font-weight: 500;
          margin-bottom: 15px;
        }

        .list {
          list-style: none;

          .item {
            font-weight: 500;
            margin-bottom: 20px;
            font-size: 1rem;
            line-height: 18px;
            cursor: pointer;

            :hover {
              color: #3d50df;
            }
          }
        }

        @media (max-width: 1100px) {
          display: none;
        }
      }

      .content {
        padding: 20px 20px 20px 5rem;
        width: calc(100% - 250px);

        @media (max-width: 1100px) {
          width: 100%;
        }

        .heading {
          font-size: 1.875rem;
          margin-bottom: 5px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .last_updated {
          font-size: 1.125rem;
          color: #3c4257;
          margin-bottom: 30px;
        }

        .page {
          h2 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 20px;
          }

          h3 {
            font-weight: 500;
            margin-bottom: 10px;
          }

          p {
            margin-bottom: 20px;
            line-height: 30px;
          }

          ol,
          ul {
            margin-left: 20px;
          }

          .link {
            text-decoration: underline;
            cursor: pointer;
            color: #3d50df;
          }

          .bold {
            font-weight: 500;
          }

          .italic {
            font-style: italic;
          }
        }
      }
    }
  }
`;
