import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

import reducers from './reducers';
import { joined } from './actions/connection';
import { recievedMessage } from './actions/chat';


const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

const addEventListeners = (dataChannel) => {
  const onOpen = () => {
    console.log('opened connection');
    store.dispatch(joined());
  };

  // if (dataChannel.readyState === 'open') onOpen();
  dataChannel.onopen = onOpen;

  dataChannel.onmessage = (e) => {
    store.dispatch(recievedMessage(JSON.parse(e.data)));
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

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(reducers);
    });
  }
}

export default store;
