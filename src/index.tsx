import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import * as Sentry from '@sentry/react';
// import * as serviceWorker from './serviceWorker';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import React from 'react';
import { defaults } from 'react-chartjs-2';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { NetworkStatus, simpuTheme } from './app/components';
import { configureAppStore, preloadedState } from './root';
import { initAmplitude } from './utils/amplitude';

initAmplitude();

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

defaults.global.defaultFontFamily = 'Averta';
defaults.global.defaultFontSize = 14;
defaults.global.defaultFontColor = '#747aa5';

const queryClient = new QueryClient();
const store = configureAppStore(preloadedState);

ReactDOM.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools position="top-left" initialIsOpen={false} />
      <BrowserRouter>
        <NetworkStatus>
          <ThemeProvider theme={simpuTheme}>
            <CSSReset />
            <App />
          </ThemeProvider>
        </NetworkStatus>
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
