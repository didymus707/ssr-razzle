import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { rootReducer } from './root.reducer';

declare const module: any;

export const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export function configureAppStore(preloadedState = {}) {
  const store = configureStore({
    preloadedState,
    reducer: rootReducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
    ],
  });

  if (process.env.NODE_ENV !== 'production' && module && module.hot) {
    module.hot.accept('./root.reducer', () => store.replaceReducer(rootReducer));
  }

  return store;
}
