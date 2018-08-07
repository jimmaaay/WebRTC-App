import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  nextStep,
  changePeerOffer,
  changeHostOffer,
  inputError,
} from '../actions/connection';
import { Button } from '../components/Button/Button';
import { newConnection } from '../actions/connection';

class Create extends Component {
  constructor(props) {
    super(props);
  
    this.sentOffer = this.sentOffer.bind(this);
    this.peerResponseChange = this.peerResponseChange.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  componentDidMount() {
    this.finishCreatingRoom = false;
    this.props.newConnection();
  }

  componentDidUpdate(prevProps) {
    const { webrtcConnection } = this.props;
    const prevWebrtcConnection = prevProps.webrtcConnection;

    if (! (prevWebrtcConnection === false && webrtcConnection !== false)) return;

    webrtcConnection.createRoom()
      .then(({ offer, finishCreatingRoom }) => {
        this.props.changeHostOffer(offer);
        this.finishCreatingRoom = finishCreatingRoom; // save to be used later
      });

  }

  peerResponseChange({target}) {
    this.props.changePeerOffer(target.value);
  }

  sentOffer() {
    this.props.nextStep();
  }

  confirm() {
    const { peerOffer, inputError } = this.props;
    if (this.finishCreatingRoom === false) {
      throw new Error('Cannot finish creating connection');
    }
    try {
      this.finishCreatingRoom(peerOffer); // TODO: should this be caught by the lib?
    } catch(e) {
      inputError('Peer offer is not valid');
    }
  }

  render() {
    const { hostOffer, peerOffer, step, validationErrors } = this.props;
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

const mapStateToProps = ({ connection }) => {
  const { 
    webrtcConnection,
    peerOffer,
    hostOffer,
    step,
    validationErrors,
  } = connection;

  return {
    webrtcConnection,
    peerOffer,
    hostOffer,
    step,
    validationErrors,
  };

};

const mapDispatchToProps = (dispatch) => {
  return {
    nextStep: _ => dispatch(nextStep()),
    changePeerOffer: _ => dispatch(changePeerOffer(_)),
    inputError: _ => dispatch(inputError(_)),
    newConnection: _ => dispatch(newConnection()),
    changeHostOffer: _ => dispatch(changeHostOffer(_)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Create);