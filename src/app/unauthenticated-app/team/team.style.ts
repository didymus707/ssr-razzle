import styled from '@emotion/styled'

export const TeamInvitePageContainer = styled.div`
  height: 100vh;
  padding: 1rem;

  .main__header {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .main__header > div {
    display: flex;
    height: 100%;
    width: 100%;
    background: #fff;
    position: absolute;
  }

  .main__header > div > span:nth-child(1) {
    width: 200px;
    height: 200px;
    margin-right: auto;
    margin-bottom: auto;
    padding-top: 2rem;
  }

  .main__header > div > span:nth-child(2) {
    width: 250px;
    height: 250px;
    margin-left: auto;
    margin-top: auto;
  }

  .main__header > div > span:nth-child(1) > img,
  .main__header > div > span:nth-child(2) > img {
    width: 100%;
    height: auto;
  }

  .main__header > div > span:nth-child(1) > img {
    animation: mymove 5s infinite;
  }
  /* Animations */
  @keyframes mymove {
    50% {
      transform: rotate(30deg);
    }
  }

  #subscription__intro {
    width: 100%;
    height: 100%;
    position: relative;
  }

  #subscription__intro .subscription__intro__bg__wrapper {
    width: 100%;
    height: 100%;
    z-index: 1000;
    background: rgba(222, 243, 253, 0.3);
  }

  .subscription__intro__wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    text-align: center;
    align-items: center;
    flex-direction: column;
    padding: 4.1875rem 1rem;
    justify-content: center;
  }

  .subscription__intro__wrapper h1 {
    margin: 0 auto;
    color: #1f4e8c;
    max-width: 600px;
    font-weight: 600;
    line-height: 52px;
    font-size: 2.8125rem;
  }

  .subscription__intro__wrapper .other-text {
    margin: 0 auto;
    color: #1f4e8c;
    max-width: 700px;
    line-height: 32px;
    font-size: 1.3rem;
  }

  .subscription__intro__wrapper h1,
  .subscription__intro__wrapper .other-text {
    margin-bottom: 1.88rem;
  }
`
