import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  initiateRTC,
  nextStep,
  changePeerOffer,
  inputError,
} from '../actions/connection';
import { Button } from '../components/Button/Button';
import { CREATING } from '../constants';

class Create extends Component {
  constructor(props) {
    super(props);
  
    this.sentOffer = this.sentOffer.bind(this);
    this.peerResponseChange = this.peerResponseChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    this.props.initiateRTC(CREATING);
  }

  peerResponseChange({target}) {
    this.props.changePeerOffer(target.value);
  }

  sentOffer() {
    this.props.nextStep();
  }

  confirm() {
    const { peerOffer, computer } = this.props.connection;
    let obj;
    try {
      obj = JSON.parse(atob(peerOffer))
    } catch(e) {
      console.log(e);
      obj = false;
    }

    if (obj !== false) {
      const answer = new RTCSessionDescription(obj);
      computer.setRemoteDescription(answer)
        .catch((e) => {
          console.log(e);
          this.props.inputError('Peer offer is not valid');
        });
    } else this.props.inputError('Peer offer is not valid');

  }

  render() {
    const { hostOffer, step, peerOffer, validationErrors } = this.props.connection;
    const hasErrorMessage = validationErrors.hasOwnProperty(step);
    const className = hasErrorMessage ? 'input-error' : '';
    const errorMessage = hasErrorMessage
    ? (<p className="error-message">{validationErrors[step]}</p>)
    : null;

    const content = step === 0
    ? (
      <Fragment>
        <label>Send this to the person you want to connect to</label>
        <input type="text" value={hostOffer} id="offer" className={className} readOnly />
        { errorMessage }
        <Button onClick={this.sentOffer}>Sent</Button>
      </Fragment>
    )
    : (
      <Fragment>
        <label>Please paste the response from the peer</label>
        <input type="text" value={peerOffer} onChange={this.peerResponseChange} className={className} />
        { errorMessage }
        <Button onClick={this.confirm}>Confirm</Button>
      </Fragment>
    );

    return (
      <div className="create">
        { content }
      </div>
    );
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
    nextStep: _ => dispatch(nextStep()),
    changePeerOffer: _ => dispatch(changePeerOffer(_)),
    inputError: _ => dispatch(inputError(_)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);