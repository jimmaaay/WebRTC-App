import { 
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_NEXT_STEP,
  NOT_CONNECTED,
  CONNECTION_JOINED,
  CONNECTED,
  CONNECTION_INPUT_ERROR,
  CONNECTION_DISCONNECTED,
  CONNECTION_EMULATOR,
  NEW_CONNECTION,
} from '../constants';

const defaultState = {
  stage: NOT_CONNECTED, // NOT_CONNECTED, JOINING, CREATING, CONNECTED
  computer: false,
  hostOffer: '',
  peerOffer: '',
  step: 0, // 0 or 1
  connectedTime: false,
  validationErrors: {}, // Keys will be page number that the error happened on
  fakeConnection: false, // used to pretend there is a connection
  webrtcConnection: false,
};

const connection = (state = defaultState, action) => {

  switch (action.type) {

    case NEW_CONNECTION: {
      return { ...defaultState, webrtcConnection: action.webrtcConnection };
    }

    case CONNECTION_CHANGE_HOST_OFFER: {
      return { ...state, hostOffer: action.offer };
    }

    case CONNECTION_NEXT_STEP: { 
      return { ...state, step: 1, validationErrors: {} };
    }

    case CONNECTION_CHANGE_PEER_OFFER: { 
      return { ...state, peerOffer: action.offer };
    }

    case CONNECTION_JOINED: {
      return { ...state, stage: CONNECTED, connectedTime: Date.now() };
    }

    case CONNECTION_INPUT_ERROR: {
      const validationErrors = {};
      validationErrors[state.step] = action.message;
      return { ...state, validationErrors };
    }

    case CONNECTION_DISCONNECTED: {
      return { ...defaultState };
    }

    case CONNECTION_EMULATOR: {
      return { ...defaultState, fakeConnection: action.fakeConnection, stage: CONNECTED };
    }

    default: {
      return state;
    }

  }

}

export default connection;
