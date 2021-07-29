import styled from "@emotion/styled";

export const AuthLayoutContainer = styled.div`
  padding-top: 40px;
  background-color: #f6fafd;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  height: 100vh;
  max-height: 100vh;

  .auth-hero {
    width: 600px;
    align-self: center;
    margin: 60px 40px 40px;

    @media (max-width: 1350px) {
      display: none;
    }
  }
`;
