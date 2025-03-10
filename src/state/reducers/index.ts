import { combineReducers } from 'redux';
import routesReducer from './routesReducer';
import userRoutesReducer from './userRoutesReducer';

export const reducers = combineReducers({
  appRoutes: routesReducer,
  userRoutes: userRoutesReducer,
});

export type RootState = ReturnType<typeof reducers>;
