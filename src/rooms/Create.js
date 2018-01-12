import React, { Component, Fragment } from 'react';
// import Clipboard from 'clipboard';
import { config, connection, errorHandler } from './webrtc';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0, // 0 based steps ;)
      offer: '',
      peerResponse: '',
    };
    
    this.sentOffer = this.sentOffer.bind(this);
    this.peerResponseChange = this.peerResponseChange.bind(this);
    this.confirm = this.confirm.bind(this);

  }
  componentDidMount() {
    const { computer, returnDataChannel } = this.props;

    this.dataChannel = computer.createDataChannel('webrtc', {
      reliable: true,
    });

    returnDataChannel(this.dataChannel);

    computer.onicecandidate = (e) => {
      if (e.candidate != null) return;
      this.setState({
        ...this.state,
        offer: btoa(JSON.stringify(computer.localDescription))
      });
    }

    computer
      .createOffer()
      .then(_ => computer.setLocalDescription(_))
      .catch(errorHandler);

    
  }

  peerResponseChange({target}) {
    this.setState({
      ...this.state,
      peerResponse: target.value,
    });
  }

  sentOffer() {
    this.setState({
      ...this.state,
      step: 1,
    });
  }


  confirm() {
    let obj;
    try {
      obj = JSON.parse(atob(this.state.peerResponse))
    } catch(e) {
      console.log(e);
    }
    const answer = new RTCSessionDescription(obj);
    this.props.computer.setRemoteDescription(answer);
  }

  render() {
    const content =  this.state.step === 0
    ? (
      <Fragment>
        <label>Send this to the person you want to connect to</label>
        <input type="text" value={this.state.offer} id="offer"/>
        {/* { button } */}
        <button onClick={this.sentOffer}>Sent</button>
      </Fragment>
    )
    : (
      <Fragment>
        <label>Please paste the response from the peer</label>
        <input type="text" value={this.state.peerResponse} onChange={this.peerResponseChange} />
        <button onClick={this.confirm}>Confirm</button>
      </Fragment>
    );

    return (
      <div>
        { content }
      </div>
    );
  }
}


export default Create;