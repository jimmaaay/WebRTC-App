import React, { Component } from 'react';
import { connect } from 'react-redux';

class EmojiPicker extends Component {

  render() {
    return (
      <div className="emoji-picker">
        <button type="button">Emojis</button>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    emoji: state.emoji,
  };
};

export default connect(mapStateToProps)(EmojiPicker);