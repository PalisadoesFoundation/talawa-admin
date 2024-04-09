import { combineReducers } from 'redux';
import routesReducer from './routesReducer';
import pluginReducer from './pluginReducer';

export const reducers = combineReducers({
  appRoutes: routesReducer,
  plugins: pluginReducer,
});

export type RootState = ReturnType<typeof reducers>;
