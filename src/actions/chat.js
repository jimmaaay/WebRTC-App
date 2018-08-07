import {
  SENDING_MESSAGE,
  SENDING_FILE,
  TYPING_MESSAGE,
  RECIEVED_MESSAGE,
  TOGGLE_NOTIFICATIONS,
  TOGGLE_SENDING_NOTIFICATIONS,
} from '../constants';

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

    return Promise.resolve();
  }
}

export const sendMessage = (message) => {

  return (dispatch, getState) => {
    const { webrtcConnection, fakeConnection } = getState().connection;
    const obj = {
      message,
      timestamp: Date.now(),
    };
    dispatch(sendingMessage(obj, fakeConnection));
    if (fakeConnection) return Promise.resolve();

    webrtcConnection.sendObject({
      message,
      timestamp: Date.now(),
    });

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
    const { webrtcConnection, fakeConnection } = getState().connection;
    dispatch(sendingFile(file, fakeConnection));
    if (fakeConnection) return Promise.resolve();
    webrtcConnection.sendFile(file);
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