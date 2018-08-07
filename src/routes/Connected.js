import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { typingMessage, sendMessage } from '../actions/chat';
import ChatWindow from '../components/ChatWindow/ChatWindow';

class Connected extends Component {

  constructor(props) {
    super(props);

    this.changeMessage = this.changeMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  // TODO: reenable the checks if peers are connected
  

  // componentDidMount() {
  //   const { history, dataChannel, fakeConnection } = this.props;

  //   if (fakeConnection === true) return;
    
  //   // Routes users back to the home page if a valid dataChannel is not present
  //   if (! (dataChannel instanceof window.RTCDataChannel)) {
  //     history.push('/');
  //   }

  // }

  // componentDidUpdate() {
  //   const { history, dataChannel, fakeConnection } = this.props;

  //   if (fakeConnection === true) return;

  //   if (! (dataChannel instanceof window.RTCDataChannel)) {
  //     /*
  //      *  TODO: don't redirect user back to home. Display a message which says chat is disconnected
  //      *  and don't let them type anything in the chat box
  //      */
  //     history.push('/');
  //   }

  // }

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
    if (currentMessage.trim() === '') return; // stops being able to send empty messages
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
    fakeConnection: state.connection.fakeConnection,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    typingMessage: (_) => dispatch(typingMessage(_)),
    sendMessage: (_) => dispatch(sendMessage(_)),
  };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Connected));