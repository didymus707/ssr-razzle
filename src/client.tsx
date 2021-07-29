import React from 'react';
import { hydrate } from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureAppStore, preloadedState } from 'root';
import App from './App';

const store = configureAppStore(preloadedState);
//@ts-ignore
const dehydratedState = window.__REACT_QUERY_STATE__;

const queryClient = new QueryClient();

hydrate(
  <BrowserRouter>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <App />
        </Hydrate>
      </QueryClientProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
