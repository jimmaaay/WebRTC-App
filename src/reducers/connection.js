import { 
  CONNECTION_INITIATE_RTC,
  CONNECTION_ADD_DATA_CHANNEL,
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_NEXT_STEP,
  NOT_CONNECTED,
  CONNECTION_JOINED,
  CONNECTED,
} from '../constants';
import { config, connection as webConnection } from '../rooms/webrtc';

const defaultState = {
  stage: NOT_CONNECTED, // NOT_CONNECTED, JOINING, CREATING, CONNECTED
  dataChannel: false,
  computer: false,
  hostOffer: '',
  peerOffer: '',
  step: 0, // 0 or 1
};

const connection = (state = defaultState, action) => {

  switch (action.type) {

    // TODO remove event listeners & destroy any active connections
    // if computer and dataChannel are already set
    case CONNECTION_INITIATE_RTC:
      return { ...defaultState, computer: action.computer, stage: action.stage };

    case CONNECTION_ADD_DATA_CHANNEL:
      return { ...state, dataChannel: action.dataChannel };

    case CONNECTION_CHANGE_HOST_OFFER:
      return { ...state, hostOffer: action.offer };

    case CONNECTION_NEXT_STEP:
      return { ...state, step: 1 };

    case CONNECTION_CHANGE_PEER_OFFER:
      return { ...state, peerOffer: action.offer };

    case CONNECTION_JOINED:
      return { ...state, stage: CONNECTED} ;

    default:
      return state;

  }

}

export default connection;
