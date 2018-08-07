import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  changeHostOffer,
  nextStep,
  changePeerOffer,
  inputError,
} from '../actions/connection';
import { Button } from '../components/Button/Button';
import { newConnection } from '../actions/connection';

class Join extends Component {
  constructor(props) {
    super(props);

    this.hostOfferChange = this.hostOfferChange.bind(this);
    this.confirmOffer = this.confirmOffer.bind(this);
  }

  componentDidMount() {
    this.props.newConnection();
  }

  hostOfferChange({target}) {
    this.props.changeHostOffer(target.value);
  }

  confirmOffer(e) {
    const {
      hostOffer,
      webrtcConnection,
      changePeerOffer,
      nextStep,
      inputError
    } = this.props;
    
    webrtcConnection.joinRoom(hostOffer)
      .then((responseOffer) => {
        changePeerOffer(responseOffer);
        nextStep();
      })
      .catch(() => {
        inputError('Host offer is not valid');
      });


  }

  render() {
    const { step, hostOffer, peerOffer, validationErrors } = this.props.connection;
    const { webrtcConnection } = this.props;
    const hasErrorMessage = validationErrors.hasOwnProperty(step);
    const className = hasErrorMessage ? 'input-error' : '';
    const errorMessage = hasErrorMessage
    ? (<p className="error-message">{validationErrors[step]}</p>)
    : null;

    const confirmDisabled = webrtcConnection === false;

    const content = step === 0
    ? (
      <Fragment>
        <label>Paste the hosts offer</label>
        <input type="text" value={hostOffer} onChange={this.hostOfferChange} className={className} />
        { errorMessage }
        <Button onClick={this.confirmOffer} disabled={confirmDisabled}>Confirm</Button>
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

const mapStateToProps = ({ connection }) => {
  const {
    webrtcConnection,
    hostOffer,
  } = connection;

  return {
    connection,
    webrtcConnection,
    hostOffer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeHostOffer: _ => dispatch(changeHostOffer(_)),
    nextStep: _ => dispatch(nextStep()),
    changePeerOffer: _ => dispatch(changePeerOffer(_)),
    inputError: _ => dispatch(inputError(_)),
    newConnection: _ => dispatch(newConnection()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Join);