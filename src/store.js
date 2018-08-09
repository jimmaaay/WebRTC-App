import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
// import SimpleWebRTCWrapper from 'simple-webrtc-wrapper';
import streamsaver, { createWriteStream } from 'streamsaver';

import reducers from './reducers';
import { joined, disconnected } from './actions/connection';
import { recievedMessage } from './actions/chat';

streamsaver.mitm = 'https://webrtc-streamsaver.jimmythompson.me/mitm.html';

const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

const addEventListeners = (connection) => {

  const fileStreams = {};
  
  connection
    .on('connected', () => {
      store.dispatch(joined());
    })
    .on('connection-closed', () => {
      store.dispatch(disconnected());
    })
    .on('message', ({ message, timestamp }) => {
      store.dispatch(recievedMessage({
        message,
        timestamp
      }));
    })
    .on('error', console.log)
    // TODO: try seeing what breaks streamsaver on chrome 70
    .on('fileChunk', ({ name, id, size, chunk }) => {
      if (! fileStreams.hasOwnProperty(id)) {
        fileStreams[id] = {
          bytesSaved: 0,
          writer: createWriteStream(name, size).getWriter(),
        };
      }
      const file = fileStreams[id];

      file.bytesSaved = file.bytesSaved + chunk.byteLength;
      file.writer.write(chunk);

      if (file.bytesSaved === size) {
        file.writer.close();
        delete fileStreams[id];
      }

    });

    return () => {
      connection.removeAllListeners();
    }

}

let setupDataChannelListeners = false;
let removeListeners = false;

store.subscribe(() => {
  const { webrtcConnection } = store.getState().connection;
  if (webrtcConnection !== false && setupDataChannelListeners === false) {
    setupDataChannelListeners = true;
    removeListeners = addEventListeners(webrtcConnection);
  } else if (webrtcConnection === false && setupDataChannelListeners === true) {
    removeListeners();
    removeListeners = false;
    setupDataChannelListeners = false;
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
