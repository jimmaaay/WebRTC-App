import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  initiateRTC,
  changeHostOffer,
  nextStep,
  changePeerOffer,
  inputError,
} from '../actions/connection';
import { sdpConstraints, errorHandler } from '../rooms/webrtc';
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
      obj = false;
    }

    if (obj !== false) {
      const offer = new RTCSessionDescription(obj);
      computer
        .setRemoteDescription(offer)
        .then(() => {
          computer
          .createAnswer(sdpConstraints)
          .then(answerDesc => computer.setLocalDescription(answerDesc))
          .catch(errorHandler);

          computer.onicecandidate = (e) => {
            if (e.candidate != null) return;
            this.props.changePeerOffer(btoa(JSON.stringify(computer.localDescription)));
          };

          this.props.nextStep();
        })
        .catch((e) => {
          console.log(e);
          this.props.inputError('Host offer is not valid');
        });


    } else this.props.inputError('Host offer is not valid');

  }

  render() {
    const { step, hostOffer, peerOffer, validationErrors } = this.props.connection;
    const hasErrorMessage = validationErrors.hasOwnProperty(step);
    const className = hasErrorMessage ? 'input-error' : '';
    const errorMessage = hasErrorMessage
    ? (<p className="error-message">{validationErrors[step]}</p>)
    : null;

    const content = step === 0
    ? (
      <Fragment>
        <label>Paste the hosts offer</label>
        <input type="text" value={hostOffer} onChange={this.hostOfferChange} className={className} />
        { errorMessage }
        <button onClick={this.confirmOffer}>Confirm</button>
      </Fragment>
    )
    : (
      <Fragment>
        <label>Send this to the host</label>
        <input type="text" value={peerOffer} className={className} readOnly/>
        { errorMessage }
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
    changeHostOffer: _ => dispatch(changeHostOffer(_)),
    nextStep: _ => dispatch(nextStep()),
    changePeerOffer: _ => dispatch(changePeerOffer(_)),
    inputError: _ => dispatch(inputError(_)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Join);