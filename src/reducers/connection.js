import { config, connection } from '../rooms/webrtc';

const defaultState = {
  stage: 'NOT_CONNECTED', // NOT_CONNECTED, JOINING, CREATING, CONNECTED
  connection: false,
  dataChannel: false,
  computer: false,
};

const connection = (state = defaultState, action) => {

  switch (action.type) {

    case 'CONNECTION_INITIATE_RTC':
      return { ...state, computer: new RTCPeerConnection(config, connection) };

    default:
      return state;

  }

}