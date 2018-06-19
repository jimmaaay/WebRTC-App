import { 
  CONNECTION_INITIATE_RTC,
  CONNECTION_ADD_DATA_CHANNEL,
  CONNECTION_CHANGE_HOST_OFFER,
  CONNECTION_NEXT_STEP,
  CONNECTION_CHANGE_PEER_OFFER,
  CONNECTION_JOINED,
  CREATING,
  CONNECTION_INPUT_ERROR,
  CONNECTION_DISCONNECTED,
} from '../constants';

import { config, connection as webConnection, errorHandler } from '../rooms/webrtc';

const generateRTC = (computer, stage) => {
  return {
    computer,
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

export const initiateRTC = (stage) => {
  return (dispatch) => {
    return new Promise((resolve) => {
      const computer = new RTCPeerConnection(config, webConnection);
      dispatch(generateRTC(computer, stage));

      if (stage === CREATING) {
        const dataChannel = computer.createDataChannel('webrtc', {
          reliable: true,
        });

        computer.onicecandidate = (e) => {
          if (e.candidate != null) return;
          dispatch(changeHostOffer(btoa(JSON.stringify(computer.localDescription))));
          resolve();
        }

        computer
          .createOffer()
          .then(_ => computer.setLocalDescription(_))
          .catch(errorHandler);

        dispatch(addDataChannel(dataChannel));
      } else {
        computer.ondatachannel = (e) => {
          const channel = e.channel || e;
          dispatch(addDataChannel(channel));
          resolve();
        }
      }

    });
  }
}