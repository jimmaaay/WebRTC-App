import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

import connection from './reducers/connection';
import { joined } from './actions/connection';


const store = createStore(
  combineReducers({
    connection,
  }),
  applyMiddleware(ReduxThunk)
);

const addEventListeners = (dataChannel) => {
  const onOpen = () => {
    console.log('opened connection');
    store.dispatch(joined());
  };

  if (dataChannel.readyState === 'open') onOpen();
  dataChannel.onopen = onOpen;

  dataChannel.onmessage = (e) => {
    console.log(e);
  };

  dataChannel.onclose = (e) => {
    console.log(e);
  };

  dataChannel.onerror = (e) => {
    console.log(e);
  };
  
};

let setupDataChannelListeners = false;

store.subscribe(() => {
  if (setupDataChannelListeners === true) return;
  const { connection } = store.getState();
  const { dataChannel } = connection;
  if (dataChannel instanceof window.RTCDataChannel) {
    setupDataChannelListeners = true;
    addEventListeners(dataChannel);
  }
});

export default store;
