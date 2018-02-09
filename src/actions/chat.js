import {
  SENDING_MESSAGE,
  TYPING_MESSAGE,
  RECIEVED_MESSAGE,
  TOGGLE_NOTIFICATIONS,
  TOGGLE_SENDING_NOTIFICATIONS,
} from '../constants';

const sendingMessage = ({message, timestamp}) => {
  return {
    timestamp,
    message,
    type: SENDING_MESSAGE,
  };
};


export const typingMessage = (message) => {
  return {
    message,
    type: TYPING_MESSAGE,
  };
};

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
};

export const sendMessage = (message) => {

  return (dispatch, getState) => {
    const obj = {
      message,
      timestamp: Date.now(),
    };
    dispatch(sendingMessage(obj));
    const { dataChannel } = getState().connection;
    if (! dataChannel instanceof window.RTCDataChannel) {
      console.log('ERROR HERE');
    }

    dataChannel.send(JSON.stringify(obj));

    return Promise.resolve();
  };

};


// auto, true or false
export const toggleNotifications = (value = 'auto') => {
  return {
    value,
    type: TOGGLE_NOTIFICATIONS,
  };
};

export const toggleShowNotification = (value = 'auto') => {
  return {
    value,
    type: TOGGLE_SENDING_NOTIFICATIONS,
  };
};