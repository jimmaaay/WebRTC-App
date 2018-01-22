import React, { Component } from 'react';
import emojis from 'emojis-list';
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
    const MAX_PAGE = Math.ceil(emojis.length / EMOJI_PER_PAGE) - 1;
    const type = target.getAttribute('data-type');
    let page;
    if (type === 'prev')  page = emoji.page - 1;
    else if (type === 'next') page = emoji.page + 1;

    if (page < 0) page = 0;

    if (page > MAX_PAGE) page = MAX_PAGE;

    this.props.changeEmojiPage(page);
    
  }

  returnList() {
    const { emoji, pickedEmoji } = this.props;
    const prevDisabled = emoji.page === 0;
    const nextDisabled = (Math.ceil(emojis.length / EMOJI_PER_PAGE) - 1) === emoji.page;


    return (
      <div className="emoji-picker__popup">
        <ul className="emoji-picker__list">
          { emojis
            .slice(emoji.page * EMOJI_PER_PAGE, (emoji.page + 1) * EMOJI_PER_PAGE)
            .map((emoji) => {
              return (
              <li key={emoji}>
                <button onClick={pickedEmoji(emoji)} type="button" className="emoji-picker__button">
                  {emoji}
                </button>
              </li>
              );
            }) 
          }
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