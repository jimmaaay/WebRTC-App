import React, { Component, Fragment } from 'react';
// import Clipboard from 'clipboard';
import { connect } from 'react-redux';
import {
  initiateRTC,
  nextStep,
  changePeerOffer,
} from '../actions/connection';
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
    }
    const answer = new RTCSessionDescription(obj);
    computer.setRemoteDescription(answer);
  }

  render() {
    const { hostOffer, step, peerOffer } = this.props.connection;
    const content = step === 0
    ? (
      <Fragment>
        <label>Send this to the person you want to connect to</label>
        <input type="text" value={hostOffer} id="offer"/>
        {/* { button } */}
        <button onClick={this.sentOffer}>Sent</button>
      </Fragment>
    )
    : (
      <Fragment>
        <label>Please paste the response from the peer</label>
        <input type="text" value={peerOffer} onChange={this.peerResponseChange} />
        <button onClick={this.confirm}>Confirm</button>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);