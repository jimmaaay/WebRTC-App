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

export const sendFile = (file) => {
  return (dispatch, getState) => {
    const { dataChannel, fakeConnection } = getState().connection;
    dispatch(sendingFile(file, fakeConnection));
    if (fakeConnection) return Promise.resolve();
    if (! (dataChannel instanceof window.RTCDataChannel)) {
      console.log('ERROR HERE');
    }

    const fileID = Date.now(); // generate this some other way?
    // const arrayBuffer = convertObjectToArrayBuffer({ fileID });
    // const parsedMessage = arrayBufferToObject(arrayBuffer);
    // console.log(arrayBuffer, parsedMessage);

    const reader = new FileReader();
    reader.onload = (e) => {
      const { result } = e.target;
      const { byteLength } = result;
      const requestHeaders = {
        byteLength,
        fileID,
        type: 'FILE',
      };
      const header = new Uint8Array(convertObjectToArrayBuffer(requestHeaders));
      const headerSize = header.byteLength;

      // First element in the buffer is the headerSize
      const maxDataSize = MAX_CHUNK_SIZE - headerSize - 1;
      const data = new Uint8Array(result);

      for (let i = 0; i < byteLength / maxDataSize; i++) {
        const start = maxDataSize * i;
        const maxEnd = byteLength - start;

        const messageSize = maxEnd <= maxDataSize
        ? maxEnd + headerSize + 1
        : maxDataSize + headerSize + 1;

        const end = maxEnd <= maxDataSize
        ? byteLength
        : start + maxDataSize;

        const toSend = new Uint8Array(messageSize);
        toSend[0] = headerSize;
        arrayBufferConcat(toSend, header, 1);
        arrayBufferConcat(toSend, data.slice(start, end), 1 + headerSize);

        dataChannel.send(toSend.buffer);
      }
    }

    reader.readAsArrayBuffer(file);


    // dataChannel.send(file);
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