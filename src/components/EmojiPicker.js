import React, { Component } from 'react';
import { lib as emojiLib } from 'emojilib';
import { connect } from 'react-redux';
import { toggleEmojiList } from '../actions/emoji';
import './EmojiPicker.css';

const fullEmojiList = Object.keys(emojiLib)
  .reduce((obj, key) => {
    const emoji = emojiLib[key];
    if (emoji.char != null) { // Don't want any of the custom emojis
      obj[key] = emoji;
    }
    return obj;
  }, {});

const fullEmojiListAsArray = Object.keys(fullEmojiList)
  .map(key => {
    const obj = { ...fullEmojiList[key] };
    obj.name = key;
    return obj;
  });

const emojisByCategory = fullEmojiListAsArray.reduce((obj, emoji) => {
  const { category } = emoji;
  if (! obj.hasOwnProperty(category)) obj[category] = [];
  obj[category].push({ ...emoji });
  return obj;
}, {});

const EMOJIS_PER_ROW = 4;

class EmojiPicker extends Component {

  getEmojiItems() {
    const { pickedEmoji } = this.props;

    return Object.keys(emojisByCategory)
      .reduce((array, key) => {
        const emojis = emojisByCategory[key];
        const emptyButtonsToAdd = EMOJIS_PER_ROW - (emojis.length % EMOJIS_PER_ROW);
        const newArray = emojis.concat(new Array(emptyButtonsToAdd).fill(null));
        return array.concat(newArray);
      }, [])
      .map((item, i) => {
        if (item == null) return <div key={i} className="emoji-picker__list__item" />
        const { char } = item;

        return (
          <div key={char} className="emoji-picker__list__item">
            <button onClick={pickedEmoji(char)} type="button" className="emoji-picker__button">
              {char}
            </button>
          </div>
        );
      });
    
  }

  returnList() {
    const { emoji } = this.props;
    const {
      currentCategory,
      knownCategories,
    } = emoji;

    return (
      <div className="emoji-picker__popup">
        <ul className="emoji-picker__categories">
          { knownCategories.map((category) => {
            // TODO: add icons for the known categories
            return (
              <li key={category}>
                {category.slice(0, 1)}
              </li>
            );
          }) }
        </ul>
        <div className="emoji-picker__list">
          { this.getEmojiItems() }
        </div >
      </div>
    );
  }

  render() {
    return (
      <div className="emoji-picker">
        <button type="button" onClick={this.props.toggleEmojiList}>Emojis</button>
        { this.props.emoji.open ? this.returnList() : null }
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    emoji: state.emoji,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleEmojiList: _ => dispatch(toggleEmojiList(_)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmojiPicker);