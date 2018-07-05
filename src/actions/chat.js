import {
  SENDING_MESSAGE,
  SENDING_FILE,
  TYPING_MESSAGE,
  RECIEVED_MESSAGE,
  TOGGLE_NOTIFICATIONS,
  TOGGLE_SENDING_NOTIFICATIONS,
  MAX_CHUNK_SIZE,
} from '../constants';

import { 
  convertObjectToArrayBuffer,
  arrayBufferToObject,
  arrayBufferConcat,
} from '../helpers.js';

const sendingMessage = ({message, timestamp}, fakeConnection) => {
  return {
    timestamp,
    message,
    fakeConnection,
    type: SENDING_MESSAGE,
  };
}


export const typingMessage = (message) => {
  return {
    message,
    type: TYPING_MESSAGE,
  };
}

const recMessage = ({message, timestamp}) => {
  return {
    timestamp,
    message,
    type: RECIEVED_MESSAGE,
  }
}

export const recievedMessage = ({message, timestamp}) => {
  return (dispatch, getState) => {
    const { chat } = getState();
    dispatch(recMessage({ message, timestamp }));
    if (chat.shouldBeSendingNotifications === true) {
      new Notification(message);
    }
    // console.log(chat);
    return Promise.resolve();
  }
}

export const sendMessage = (message) => {

  return (dispatch, getState) => {
    const { dataChannel, fakeConnection } = getState().connection;
    const obj = {
      message,
      timestamp: Date.now(),
    };
    dispatch(sendingMessage(obj, fakeConnection));
    if (fakeConnection) return Promise.resolve();
    if (! (dataChannel instanceof window.RTCDataChannel)) {
      console.log('ERROR HERE');
    }

    dataChannel.send(JSON.stringify(obj));

    return Promise.resolve();
  };

}

const sendingFile = (file, fakeConnection) => {
  return {
    file,
    fakeConnection,
    type: SENDING_FILE,
  };
}

// TODO: should probably request permission to send files from other peer first
export const sendFile = (file) => {
  return (dispatch, getState) => {
    const { dataChannel, fakeConnection } = getState().connection;
    dispatch(sendingFile(file, fakeConnection));
    if (fakeConnection) return Promise.resolve();
    if (! (dataChannel instanceof window.RTCDataChannel)) {
      console.log('ERROR HERE');
    }

    const fileID = Date.now(); // generate this some other way?
    const requestHeaders = {
      fileID,
      type: 'FILE',
      size: file.size,
      name: file.name,
    };

    const reader = new FileReader();
    const header = new Uint8Array(convertObjectToArrayBuffer(requestHeaders));
    const headerSize = header.byteLength;
    const maxDataSize = MAX_CHUNK_SIZE - headerSize - 1;

    let dataSize = 0;

    const send = (file, header, maxDataSize, chunk, dataChannel, cb) => {
      const start = maxDataSize * chunk;
      const maxEnd = file.size - start;

      const messageSize = maxEnd <= maxDataSize
      ? maxEnd + headerSize + 1
      : maxDataSize + headerSize + 1;

      const end = maxEnd <= maxDataSize
      ? file.size
      : start + maxDataSize;

      reader.onload = (e) => {
        const toSend = new Uint8Array(messageSize);
        const data = new Uint8Array(e.target.result);
        toSend[0] = header.byteLength;
        arrayBufferConcat(toSend, header, 1);
        arrayBufferConcat(toSend, data, 1 + headerSize);

        console.log(toSend);
        
        dataChannel.send(toSend);
        if (end === file.size) return cb();

        // TODO: maybe add a timeout to throttle sending data?
        setTimeout(() => {
          send(file, header, maxDataSize, ++chunk, dataChannel, cb);
        }, 0);

      }

      dataSize = dataSize + end - start;

      reader.readAsArrayBuffer(file.slice(start, end));
    }

    send(file, header, maxDataSize, 0, dataChannel, () => {
      console.log(dataSize, file);
      console.log('sent file');
    });

    return Promise.resolve();
  }
}


// auto, true or false
export const toggleNotifications = (value = 'auto') => {
  return {
    value,
    type: TOGGLE_NOTIFICATIONS,
  };
}

export const toggleShowNotification = (value = 'auto') => {
  return {
    value,
    type: TOGGLE_SENDING_NOTIFICATIONS,
  };
}