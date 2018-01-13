import { createStore, combineReducers } from 'redux';
import connection from './reducers/connection';

const store = createStore(combineReducers({
  connection,
}));