import React, { Component } from 'react';
import { lib as emojiLib } from 'emojilib';
import { List } from 'react-virtualized';
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
const fontSize = parseInt(window.getComputedStyle(document.documentElement).fontSize);

class EmojiPicker extends Component {

  getEmojiItems() {
    const { pickedEmoji } = this.props;

    const rows = [ [] ];

    for (let key in emojisByCategory) {
      const emojiCat = emojisByCategory[key];
      emojiCat.forEach((emoji) => {
        if (rows[rows.length - 1].length === 4) rows.push([]); //  only want 4 in a row
        rows[rows.length -1].push(emoji);
      });
      const lastRow = rows[rows.length - 1];
      if (lastRow.length < 4) {
        const newArray = lastRow.concat(new Array(4 - lastRow.length).fill(null));
        rows[rows.length - 1] = newArray;
      }
      
    }

    console.log(rows);

    // const emojiRows = Object.keys(emojisByCategory)
    //   .reduce((array, key) => {
    //     const emojis = emojisByCategory[key];
    //     const emptyButtonsToAdd = EMOJIS_PER_ROW - (emojis.length % EMOJIS_PER_ROW);
    //     const newArray = emojis.concat(new Array(emptyButtonsToAdd).fill(null));
    //     return array.concat(newArray);
    //   }, [])
    //   .reduce((newArray, arrayItem) => {

    //   }, );
      // .map((item, i) => {
      //   if (item == null) return <div key={i} className="emoji-picker__list__item" />
      //   const { char } = item;

      //   return (
      //     <div key={char} className="emoji-picker__list__item">
      //       <button onClick={pickedEmoji(char)} type="button" className="emoji-picker__button">
      //         {char}
      //       </button>
      //     </div>
      //   );
      // });

    return (
      <List 
        height={15 * fontSize}
        width={20 * fontSize}
        rowCount={rows.length}
        rowHeight={3 * fontSize}
        rowRenderer={({ index }) => {
          const row = rows[index];
          const items = row.map((item, i) => {
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
          return (
            <div key={index}>
              { items }
            </div>
          );
        }}
      />
    )

    // return Object.keys(emojisByCategory)
    //   .reduce((array, key) => {
    //     const emojis = emojisByCategory[key];
    //     const emptyButtonsToAdd = EMOJIS_PER_ROW - (emojis.length % EMOJIS_PER_ROW);
    //     const newArray = emojis.concat(new Array(emptyButtonsToAdd).fill(null));
    //     return array.concat(newArray);
    //   }, [])
    //   .map((item, i) => {
    //     if (item == null) return <div key={i} className="emoji-picker__list__item" />
    //     const { char } = item;

    //     return (
    //       <div key={char} className="emoji-picker__list__item">
    //         <button onClick={pickedEmoji(char)} type="button" className="emoji-picker__button">
    //           {char}
    //         </button>
    //       </div>
    //     );
    //   });
    
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