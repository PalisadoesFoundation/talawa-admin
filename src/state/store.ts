import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './reducers/index';

export const store = configureStore({
  reducer: reducers,
});

export type AppDispatch = typeof store.dispatch;
