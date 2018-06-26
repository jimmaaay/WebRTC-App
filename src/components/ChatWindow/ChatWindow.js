import React, { Component } from 'react';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import styles from './ChatWindow.css';
import { Button } from '../Button/Button';

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
        let className = styles.ChatWindowItem;
        if (author === 'SELF') className += ` ${styles['ChatWindowItem--self']}`;
        else className += ` ${styles['ChatWindowItem--peer']}`;

        array.push(
          <li key={key} className={className}>{msg}</li>
        );
      });
    }

    array.unshift(
      <li key="connected" className={`${styles.ChatWindowItem} ${styles['ChatWindowItem--details']}`}>
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
      <div className={styles.ChatWindow}>
        <div className={styles.ChatWindowTextBox} ref={(ref) => this.textBox = ref}>{this.chatBox()}</div>
        <form onSubmit={this.props.sendMessage} className={styles.ChatWindowBottom}>
          <input type="text" value={this.props.currentMessage} onChange={this.props.changeMessage} />
          <EmojiPicker pickedEmoji={this.pickedEmoji} />
          <Button type="submit" className={styles.ChatWindowSend}>Send</Button>
        </form>
      </div>
    )
  }

}


export default ChatWindow;