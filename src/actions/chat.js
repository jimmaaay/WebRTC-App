import {
  SENDING_MESSAGE,
  TYPING_MESSAGE,
  RECIEVED_MESSAGE,
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


export const recievedMessage = ({message, timestamp}) => {
  return {
    timestamp,
    message,
    type: RECIEVED_MESSAGE,
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
}