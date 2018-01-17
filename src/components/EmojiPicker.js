import React, { Component } from 'react';
import emojis from 'emojis-list';
import { connect } from 'react-redux';
import { toggleEmojiList, changeEmojiPage } from '../actions/emoji';
import './EmojiPicker.css';

const EMOJI_PER_PAGE = 20;
const MAX_PAGE = 100; // TODO: set max page

class EmojiPicker extends Component {

  constructor(props) {
    super(props);
    this.changePage = this.changePage.bind(this);
  }

  changePage({target}) {
    const { emoji } = this.props;
    const type = target.getAttribute('data-type');
    let page;
    if (type === 'prev')  page = emoji.page - 1;
    else if (type === 'next') page = emoji.page + 1;

    if (page < 0) page = 0;

    if (page > MAX_PAGE) page = MAX_PAGE;

    console.log(emoji.page, page);

    this.props.changeEmojiPage(page);
    
  }

  returnList() {
    const { emoji } = this.props;
    return (
      <div className="emoji-picker__popup">
        <ul className="emoji-picker__list">
          { emojis
            .slice(emoji.page * EMOJI_PER_PAGE, (emoji.page + 1) * EMOJI_PER_PAGE)
            .map((emoji) => {
              return <li key={emoji}>{emoji}</li>
            }) 
          }
        </ul>
        <button onClick={this.changePage} data-type="prev" type="button">Prev</button>
        <button onClick={this.changePage} data-type="next" type="button">Next</button>
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