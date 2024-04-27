import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { reducers } from './reducers/index';

export const store = createStore(reducers, {}, applyMiddleware(thunk));
