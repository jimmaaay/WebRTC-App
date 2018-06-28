import { 
  CONNECTION_INITIATE_RTC,
  CONNECTION_ADD_DATA_CHANNEL,
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_NEXT_STEP,
  NOT_CONNECTED,
  CONNECTION_JOINED,
  CONNECTED,
  CONNECTION_INPUT_ERROR,
  CONNECTION_DISCONNECTED,
  CONNECTION_EMULATOR,
} from '../constants';

const defaultState = {
  stage: NOT_CONNECTED, // NOT_CONNECTED, JOINING, CREATING, CONNECTED
  dataChannel: false,
  computer: false,
  hostOffer: '',
  peerOffer: '',
  step: 0, // 0 or 1
  connectedTime: false,
  validationErrors: {}, // Keys will be page number that the error happened on
  fakeConnection: false, // used to pretend there is a connection
};

const connection = (state = defaultState, action) => {

  switch (action.type) {

    // TODO remove event listeners & destroy any active connections
    // if computer and dataChannel are already set
    case CONNECTION_INITIATE_RTC:
      return { ...defaultState, computer: action.computer, stage: action.stage, validationErrors: {} };

    case CONNECTION_ADD_DATA_CHANNEL:
      return { ...state, dataChannel: action.dataChannel };

    case CONNECTION_CHANGE_HOST_OFFER:
      return { ...state, hostOffer: action.offer };

    case CONNECTION_NEXT_STEP:
      return { ...state, step: 1, validationErrors: {} };

    case CONNECTION_CHANGE_PEER_OFFER:
      return { ...state, peerOffer: action.offer };

    case CONNECTION_JOINED:
      return { ...state, stage: CONNECTED, connectedTime: Date.now() };

    case CONNECTION_INPUT_ERROR:
      const validationErrors = {};
      validationErrors[state.step] = action.message;
      return { ...state, validationErrors };

    case CONNECTION_DISCONNECTED: 
      return { ...defaultState };

    case CONNECTION_EMULATOR:
      return { ...defaultState, fakeConnection: action.fakeConnection, stage: CONNECTED };

    default:
      return state;

  }

}

export default connection;
