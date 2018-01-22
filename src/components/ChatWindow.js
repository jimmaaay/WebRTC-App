import React, { Component } from 'react';
import EmojiPicker from './EmojiPicker';
import './ChatWindow.css';

class ChatWindow extends Component {

  constructor(props) {
    super(props);

    this.pickedEmoji = this.pickedEmoji.bind(this);
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

  componentDidUpdate(prevProps) {
    const { messages } = this.props;
    const { messages: oldMessages } = prevProps;
    // messages & oldMessages will be same object if no new messages??
    if (messages !== oldMessages) {
      const { textBox } = this;
      textBox.scrollTop = textBox.scrollHeight - textBox.clientHeight;
    }

  }

  pickedEmoji(emoji) {

    return () => {
      const { changeMessage, currentMessage } = this.props;
      // Fake e.target.value
      changeMessage({
        target: {
          value: currentMessage + emoji,
        }
      });
    };

  }


  render() {
    return (
      <div className="chat-window">
        <div className="chat-window__text-box" ref={(ref) => this.textBox = ref}>{this.chatBox()}</div>
        <form onSubmit={this.props.sendMessage} className="chat-window__bottom">
          <input type="text" value={this.props.currentMessage} onChange={this.props.changeMessage} />
          <EmojiPicker pickedEmoji={this.pickedEmoji} />
          <button type="submit" className="chat-window__send">Send</button>
        </form>
      </div>
    )
  }

}


export default ChatWindow;