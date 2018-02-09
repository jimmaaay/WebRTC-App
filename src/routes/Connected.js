import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { typingMessage, sendMessage } from '../actions/chat';
import ChatWindow from '../components/ChatWindow';

class Connected extends Component {

  constructor(props) {
    super(props);

    this.changeMessage = this.changeMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    const { history, dataChannel } = this.props;
    // TODO: check dataChannel is actually connected??
    // Routes users back to the home page if a valid dataChannel is not present
    if (! (dataChannel instanceof window.RTCDataChannel)) {
      history.push('/');
    }

  }

  chatBox() {
    const { connectedTime, messages } = this.props;

    const array = [];

    for (let timestamp in messages) {
      const messageGroup = messages[timestamp];
      messageGroup.forEach(({ message: msg, author }, i) => {
        const key = `${timestamp}-${i}`;
        let className = 'chat-window__item';
        if (author === 'SELF') className += ' chat-window__item--self';
        else className += ' chat-window__item--peer';

        array.push(
          <li key={key} className={className}>{msg}</li>
        )
      });
    }

    array.unshift(
      <li key="connected" className="chat-window__item chat-window__item--details">
        Connected -{ connectedTime }
      </li>
    );

    return (
      <ul>
        { array }
      </ul>
    );
  }


  sendMessage(e) {
    e.preventDefault();
    const { sendMessage, currentMessage } = this.props;
    sendMessage(currentMessage);
  }

  changeMessage(e) {
    const { typingMessage } = this.props;
    typingMessage(e.target.value);
  }

  render() {

    return (
      <div>
        <ChatWindow 
          sendMessage={this.sendMessage} 
          currentMessage={this.props.currentMessage} 
          changeMessage={this.changeMessage}
          messages={this.props.messages}
          connectedTime={this.props.connectedTime}
        />
      </div>
    );

  }

}


const mapStateToProps = (state) => {
  return {
    connectedTime: state.connection.connectedTime,
    dataChannel: state.connection.dataChannel,
    messages: state.chat.messages,
    currentMessage: state.chat.currentMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    typingMessage: (_) => dispatch(typingMessage(_)),
    sendMessage: (_) => dispatch(sendMessage(_)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Connected));