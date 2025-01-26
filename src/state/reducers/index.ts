import { combineReducers } from 'redux';
import routesReducer from './routesReducer';
import pluginReducer from './pluginReducer';
import userRoutesReducer from './userRoutesReducer';

export const reducers = combineReducers({
  appRoutes: routesReducer,
  plugins: pluginReducer,
  userRoutes: userRoutesReducer,
});

export type RootState = ReturnType<typeof reducers>;
