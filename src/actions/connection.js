import SimpleWebRTCWrapper from 'simple-webrtc-wrapper';
import { 
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_NEXT_STEP,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_JOINED,
  CONNECTION_INPUT_ERROR,
  CONNECTION_DISCONNECTED,
  CONNECTION_EMULATOR,
  NEW_CONNECTION,
} from '../constants';


export const newConnection = () => {
  return {
    webrtcConnection: new SimpleWebRTCWrapper(),
    type: NEW_CONNECTION,
  };
}


export const changeHostOffer = (offer) => {
  return {
    offer,
    type: CONNECTION_CHANGE_HOST_OFFER,
  };
}

export const changePeerOffer = (offer) => {
  return {
    offer,
    type: CONNECTION_CHANGE_PEER_OFFER,
  };
}

export const nextStep = () => {
  return {
    type: CONNECTION_NEXT_STEP,
  };
}

export const inputError = (message) => {
  return {
    message,
    type: CONNECTION_INPUT_ERROR,
  };
}

export const joined = () => {
  return {
    type: CONNECTION_JOINED,
  };
}

export const disconnected = () => {
  return {
    type: CONNECTION_DISCONNECTED,
  };
}

export const emulateConnection = (fakeConnection) => {
  return {
    fakeConnection,
    type: CONNECTION_EMULATOR,
  };
}
