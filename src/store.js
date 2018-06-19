import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'

import reducers from './reducers';
import { joined, disconnected } from './actions/connection';
import { recievedMessage } from './actions/chat';


const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

const addEventListeners = (dataChannel) => {

  const removeEventListeners = () => {
    dataChannel.removeEventListener('open', onOpen);
    dataChannel.removeEventListener('message', onMessage);
    dataChannel.removeEventListener('close', onClose);
    dataChannel.removeEventListener('error', onError);
    window.removeEventListener('beforeunload', onBrowserClose);

    setupDataChannelListeners = false;
  }

  const onOpen = () => {
    console.log('opened connection');
    store.dispatch(joined());
  }

  const onMessage = (e) => {
    console.log(e);
    store.dispatch(recievedMessage(JSON.parse(e.data)));
  }

  const onClose = (e) => {
    console.log(e);
    store.dispatch(disconnected());
    removeEventListeners();
  }

  const onError = (e) => {
    console.log(e);
  }

  const onBrowserClose = _ => dataChannel.close();

  if (dataChannel.readyState === 'open') onOpen();
  else dataChannel.addEventListener('open', onOpen);

  dataChannel.addEventListener('message', onMessage);
  dataChannel.addEventListener('close', onClose);
  dataChannel.addEventListener('error', onError);
  
  /**
   * Sometimes the web rtc connection doesn't close when quitting the tab so this
   * makes sure that the connection closes.
   */
  window.addEventListener('beforeunload', onBrowserClose);
}

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

window.store = store;

export default store;
