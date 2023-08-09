import { combineReducers } from 'redux';
import routesReducer from './routesReducer';
import pluginReducer from './pluginReducer';
import refetchReducer from './refetchOrgListReducer';

export const reducers = combineReducers({
  appRoutes: routesReducer,
  plugins: pluginReducer,
  refetch: refetchReducer,
});

export type RootState = ReturnType<typeof reducers>;
