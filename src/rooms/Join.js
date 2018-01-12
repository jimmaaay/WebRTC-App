import React, { Component, Fragment } from 'react';
import { config, connection, sdpConstraints, errorHandler } from './webrtc';

class Join extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0, // 0 based steps ;)
      hostOffer: '',
      myOffer: '',
    };

    
    this.hostOfferChange = this.hostOfferChange.bind(this);
    this.confirmOffer = this.confirmOffer.bind(this);
  }

  componentDidMount() {
    const { computer, returnDataChannel } = this.props;
    computer.ondatachannel = (e) => {
      const channel = e.channel || e;
      returnDataChannel(channel);
    };
  }


  hostOfferChange(e) {
    this.setState({
      ...this.state,
      hostOffer: e.target.value,
    });
  }

  confirmOffer(e) {
    const { computer } = this.props;
    let obj;
    try {
      obj = JSON.parse(atob(this.state.hostOffer));
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
      this.setState({
        ...this.state,
        myOffer: btoa(JSON.stringify(computer.localDescription)),
        step: 1,
      });
    };

  }

  render() {
    const content = this.state.step === 0
    ? (
      <Fragment>
        <label>Paste the hosts offer</label>
        <input type="text" value={this.state.hostOffer} onChange={this.hostOfferChange} />
        <button onClick={this.confirmOffer}>Confirm</button>
      </Fragment>
    )
    : (
      <Fragment>
        <label>Send this to the host</label>
        <input type="text" value={this.state.myOffer} />
      </Fragment>
    );

    return (
      <div>
        { content }
      </div>
    )
  }
}

export default Join;