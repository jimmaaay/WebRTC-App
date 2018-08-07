import { combineReducers } from 'redux';
import chat from './chat';
import connection from './connection';
import emoji from './emoji';

export default combineReducers({
  chat,
  connection,
  emoji,
});