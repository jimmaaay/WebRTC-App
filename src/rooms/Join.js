import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  initiateRTC,
  addDataChannel,
  changeHostOffer,
  nextStep,
  changePeerOffer,
} from '../actions/connection';
import { sdpConstraints, errorHandler } from './webrtc';
import { JOINING } from '../constants';

class Join extends Component {
  constructor(props) {
    super(props);

    this.hostOfferChange = this.hostOfferChange.bind(this);
    this.confirmOffer = this.confirmOffer.bind(this);
  }

  componentDidMount() {
    this.props.initiateRTC(JOINING);
  }

  componentWillReceiveProps(nextProps) {
    const { computer } = nextProps.connection;
    if (this.props.connection.computer === false && computer instanceof RTCPeerConnection) {
      computer.ondatachannel = (e) => {
        const channel = e.channel || e;
        this.props.addDataChannel(channel);
      };
    }
  }


  hostOfferChange({target}) {
    this.props.changeHostOffer(target.value);
  }

  confirmOffer(e) {
    const { computer, hostOffer } = this.props.connection;
    let obj;
    try {
      obj = JSON.parse(atob(hostOffer));
    } catch(e) {
      console.log(e);
    }
    const offer = new RTCSessionDescription(obj);
    computer.setRemoteDescription(offer);
    computer
      .createAnswer(sdpConstraints)
      .then(answerDesc => computer.setLocalDescription(answerDesc))
      .catch(errorHandler);

    computer.onicecandidate = (e) => {
      if (e.candidate != null) return;
      this.props.changePeerOffer(btoa(JSON.stringify(computer.localDescription)));
    };

    this.props.nextStep();
  }

  render() {
    const { step, hostOffer, peerOffer } = this.props.connection;
    const content = step === 0
    ? (
      <Fragment>
        <label>Paste the hosts offer</label>
        <input type="text" value={hostOffer} onChange={this.hostOfferChange} />
        <button onClick={this.confirmOffer}>Confirm</button>
      </Fragment>
    )
    : (
      <Fragment>
        <label>Send this to the host</label>
        <input type="text" value={peerOffer} />
      </Fragment>
    );

    return (
      <div>
        { content }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    connection: state.connection,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initiateRTC: _ => dispatch(initiateRTC(_)),
    addDataChannel: _ => dispatch(addDataChannel(_)),
    changeHostOffer: _ => dispatch(changeHostOffer(_)),
    nextStep: _ => dispatch(nextStep()),
    changePeerOffer: _ => dispatch(changePeerOffer(_)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Join);