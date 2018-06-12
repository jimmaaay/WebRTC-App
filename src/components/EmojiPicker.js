import React, { Component } from 'react';
import { lib as emojiLib } from 'emojilib';
import { connect } from 'react-redux';
import { toggleEmojiList, changeEmojiPage } from '../actions/emoji';
import './EmojiPicker.css';

const EMOJI_PER_PAGE = 20;

class EmojiPicker extends Component {

  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }

  changePage({target}) {
    const { emoji } = this.props;
    const MAX_PAGE = Math.ceil(Object.keys(emojiLib).length / EMOJI_PER_PAGE) - 1;
    const type = target.getAttribute('data-type');
    let page;
    if (type === 'prev')  page = emoji.page - 1;
    else if (type === 'next') page = emoji.page + 1;

    if (page < 0) page = 0;

    if (page > MAX_PAGE) page = MAX_PAGE;

    this.props.changeEmojiPage(page);
  }

  returnList() {
    // TODO: optimise way of getting emojis. Should generate an array from the beggining
    // TODO: stop emojiLib pulling through custom emojis? ( see last page of emoji picker )
    const { emoji, pickedEmoji } = this.props;
    const {
      currentCategory,
      page,
      knownCategories,
    } = emoji;
    const prevDisabled = false;
    const nextDisabled = false;

    const filteredEmojis = currentCategory === false
    ? emojiLib
    : Object.keys(emojiLib)
      .reduce((ret, key) => {
        const { category } = emojiLib[key];
        if (category === currentCategory) {
          ret[key] = emojiLib[key];
        }
        return ret;
      }, {});

    const itemsToShow = Object.keys(filteredEmojis)
      .slice(page * EMOJI_PER_PAGE, (page + 1) * EMOJI_PER_PAGE)
      .map(key => emojiLib[key]);


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
        <ul className="emoji-picker__list">
          { itemsToShow.map(({ char }) => {
            return (
            <li key={char}>
              <button onClick={pickedEmoji(char)} type="button" className="emoji-picker__button">
                {char}
              </button>
            </li>
            );
          }) }
        </ul>
        <div className="emoji-picker__buttons">
          <button 
            onClick={this.changePage} 
            data-type="prev" 
            type="button"
            className="emoji-picker__prev"
            disabled={prevDisabled}>
            Prev
          </button>
          <button 
            onClick={this.changePage} 
            data-type="next" 
            type="button"
            className="emoji-picker__next"
            disabled={nextDisabled}>
            Next
          </button>
        </div>
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
    changeEmojiPage: _ => dispatch(changeEmojiPage(_)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmojiPicker);