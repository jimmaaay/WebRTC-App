import {
  SENDING_MESSAGE,
  TYPING_MESSAGE,
  RECIEVED_MESSAGE,
  TOGGLE_NOTIFICATIONS,
  TOGGLE_SENDING_NOTIFICATIONS,
  CONNECTION_DISCONNECTED,
} from '../constants';

const defaultState = {
  messages: {},
  currentMessage: '',


  // If notifications should be sent when the window isn't in view
  sendNotifications: false,

  // If the current message recieved should be sent as a notification
  shouldBeSendingNotifications: false,
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

    case TOGGLE_NOTIFICATIONS:
      const sendNotifications = action.value === 'auto' ? !state.sendNotifications : action.value;
      const sBSN = sendNotifications === false ? false : state.shouldBeSendingNotifications; 
      return { ...state, sendNotifications, shouldBeSendingNotifications: sBSN };

    case TOGGLE_SENDING_NOTIFICATIONS:
      const shouldBeSendingNotifications = action.value === 'auto' ? !state.shouldBeSendingNotifications : action.value;
      return { ...state, shouldBeSendingNotifications };


    case CONNECTION_DISCONNECTED:
      return { ...defaultState };

    default:
      return state;
  }

}


export default chat;