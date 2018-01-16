import {
  SENDING_MESSAGE,
  TYPING_MESSAGE,
  RECIEVED_MESSAGE,
} from '../constants';

const defaultState = {
  messages: {},
  currentMessage: '',
};

const chat = (state = defaultState, action) => {

  switch (action.type) {

    case RECIEVED_MESSAGE:
    case SENDING_MESSAGE:
      const messages = { ...state.messages };
      if (! messages.hasOwnProperty(action.timestamp)) {
        messages[action.timestamp] = [];
      }

      messages[action.timestamp].push({
        message: action.message,
        author: action.type === SENDING_MESSAGE ? 'SELF' : 'PEER',
      });

      const currentMessage = action.type === SENDING_MESSAGE ? '' : state.currentMessage;

      return { ...state, messages, currentMessage };

    case TYPING_MESSAGE:
      return { ...state, currentMessage: action.message };
      

    default:
      return state;
  }

}


export default chat;