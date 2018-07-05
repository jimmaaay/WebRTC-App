import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import streamsaver, { createWriteStream } from 'streamsaver';

import reducers from './reducers';
import { joined, disconnected } from './actions/connection';
import { recievedMessage } from './actions/chat';
import { arrayBufferToObject } from './helpers';

streamsaver.mitm = 'https://webrtc-streamsaver.jimmythompson.me/mitm.html';

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

  const fileStreams = {};

  const onMessage = (e) => {
    console.log(e, typeof e.data);
    if (typeof e.data === 'string') {
      store.dispatch(recievedMessage(JSON.parse(e.data)));
    } else {
      const fullResponse = new Uint8Array(e.data);
      const headerSize = fullResponse[0]; // first item lists header size
      const headerArrayBuffer = fullResponse.slice(1, headerSize + 1); // header data
      const headerData = arrayBufferToObject(headerArrayBuffer); // converts the header data to an object
      const { name, fileID, size } = headerData;
      const fileData = fullResponse.slice(headerSize + 1);
      console.log(fileData);
      const key = name + fileID;
      
      if (! fileStreams.hasOwnProperty(key)) {
        fileStreams[key] = {
          bytesSaved: 0,
          writer: createWriteStream(name, size).getWriter(),
        };
      }

      const file = fileStreams[key];
      
      const { writer } = file
      file.bytesSaved = file.bytesSaved + fileData.byteLength;

      writer.write(fileData);

      // console.

      if (file.bytesSaved === size) {
        console.log('saved file??');
        writer.close();
        delete fileStreams[key];
      }

    }
  }

  const onClose = (e) => {
    console.log(e);
    store.dispatch(disconnected());
    removeEventListeners();
  }

  const onError = (e) => {
    console.log(e);
  }

  const onBrowserClose = e => {
    console.log(e);
    // dataChannel.close(); // this is causing issues with streamSaver. Maybe when it has to open the iframe?
  }

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
