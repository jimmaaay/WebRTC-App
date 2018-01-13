import { 
  CONNECTION_INITIATE_RTC,
  CONNECTION_ADD_DATA_CHANNEL,
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_NEXT_STEP,
  NOT_CONNECTED,
} from '../constants';
import { config, connection as webConnection } from '../rooms/webrtc';
import { joined } from '../actions/connection';

const defaultState = {
  stage: NOT_CONNECTED, // NOT_CONNECTED, JOINING, CREATING, CONNECTED
  dataChannel: false,
  computer: false,
  hostOffer: '',
  peerOffer: '',
  step: 0, // 0 or 1
};

const addEventListeners = (dataChannel) => {
  dataChannel.onopen = () => {
    console.log('opened data channel');
  };

  dataChannel.onmessage = (e) => {
    console.log(e);
  };

  dataChannel.onclose = (e) => {
    console.log(e);
  };

  dataChannel.onerror = (e) => {
    console.log(e);
  };
};

const connection = (state = defaultState, action) => {

  switch (action.type) {

    case CONNECTION_INITIATE_RTC:
      return { ...state, computer: new RTCPeerConnection(config, webConnection), stage: action.stage };

    case CONNECTION_ADD_DATA_CHANNEL:
      addEventListeners(action.dataChannel);
      return { ...state, dataChannel: action.dataChannel };

    case CONNECTION_CHANGE_HOST_OFFER:
      return { ...state, hostOffer: action.offer };

    case CONNECTION_NEXT_STEP:
      return { ...state, step: 1 };

    case CONNECTION_CHANGE_PEER_OFFER:
      return { ...state, peerOffer: action.offer };

    default:
      return state;

  }

}

export default (store) => {
  console.log(store);
  return connection;
}
