import { 
  CONNECTION_INITIATE_RTC,
  CONNECTION_ADD_DATA_CHANNEL,
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_NEXT_STEP,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_JOINED,
} from '../constants';

export const initiateRTC = (stage) => {
  return {
    stage,
    type: CONNECTION_INITIATE_RTC,
  };
};

export const addDataChannel = (dataChannel) => {
  return {
    dataChannel,
    type: CONNECTION_ADD_DATA_CHANNEL,
  };
};

export const changeHostOffer = (offer) => {
  return {
    offer,
    type: CONNECTION_CHANGE_HOST_OFFER,
  };
};

export const changePeerOffer = (offer) => {
  return {
    offer,
    type: CONNECTION_CHANGE_PEER_OFFER,
  };
};

export const nextStep = () => {
  return {
    type: CONNECTION_NEXT_STEP,
  };
};

export const joined = () => {
  return {
    type: CONNECTION_JOINED,
  };
};