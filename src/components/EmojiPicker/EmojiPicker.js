import React, { Component, Fragment } from 'react';
import { lib as emojiLib } from 'emojilib';
import { List } from 'react-virtualized';
import { connect } from 'react-redux';
import { Button } from '../Button/Button';
import {
  toggleEmojiList,
  changeCurrentCatgeory,
  changeScrollTop,
} from '../../actions/emoji';
import {
  thisOrParentMatches,
} from '../../helpers'
import styles from './EmojiPicker.css';

// Icons sourced from https://material.io/tools/icons/?style=outline
import airplane from '../../icons/airplane.svg';
import fastfood from '../../icons/fastfood.svg';
import flag from '../../icons/flag.svg';
import person from '../../icons/person.svg';
import pets from '../../icons/pets.svg';
import pool from '../../icons/pool.svg';
import watch from '../../icons/watch.svg';

const icons = {
  people: person,
  animals_and_nature: pets,
  food_and_drink: fastfood,
  activity: pool,
  travel_and_places: airplane,
  objects: watch,
  flags: flag,
};

// console.log(airplane);

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

const emojiCategories = [
  'people',
  'animals_and_nature',
  'food_and_drink',
  'activity',
  'travel_and_places',
  'objects',
  'flags',
  'symbols',
];

const normaliseCategoryTitle = title => {
  const tempTitle = title.replace(/_(\w)/g, (_, char) => ` ${char.toUpperCase()}`);
  return tempTitle[0].toUpperCase() + tempTitle.slice(1);
}

const getLastTitleInView = (titles, scrollTop) => {
  return titles.reduce((ret, obj) => {
    const { y } = obj;
    if (ret === false) return obj;
    if (y <= scrollTop) return obj;
    return ret;
  }, false);
}

const EMOJIS_PER_ROW = 4;
const fontSize = parseInt(window.getComputedStyle(document.documentElement).fontSize, 10);

const titlePositions = [];

const rows = emojiCategories.reduce((array, categoryName) => {
  const emojiCat = emojisByCategory[categoryName];
  const emojiArray = emojiCat.reduce((ret, emoji, i) => {
    if (i % EMOJIS_PER_ROW === 0) ret.push([]);
    ret[ret.length - 1].push(emoji);
    return ret;
  }, []);
  const lastRow = emojiArray[emojiArray.length - 1];
  if (lastRow.length < EMOJIS_PER_ROW) {
    const newArray = lastRow.concat(new Array(EMOJIS_PER_ROW - lastRow.length).fill(null));
    emojiArray[emojiArray.length - 1] = newArray;
  }
  emojiArray.unshift(categoryName);
  titlePositions.push({
    categoryName, 
    y: array.length * fontSize * 3,
  });
  return array.concat(emojiArray);
}, []);


class EmojiPicker extends Component {

  constructor(props) {
    super(props);
    this.listScroll = this.listScroll.bind(this);
    this.categoryButtonClick = this.categoryButtonClick.bind(this);
  }

  listScroll({ scrollTop }) {
    const {
      currentCategory,
      changeCurrentCatgeory,
      changeScrollTop,
    } = this.props;

    changeScrollTop(scrollTop);
    const lastInViewCategory = getLastTitleInView(titlePositions, scrollTop);

    if (lastInViewCategory.categoryName === currentCategory) return;
    changeCurrentCatgeory(lastInViewCategory.categoryName);
  }

  getEmojiItems() {
    const { pickedEmoji, scrollTop } = this.props;

    return (
      <List 
        height={15 * fontSize}
        width={20 * fontSize}
        rowCount={rows.length}
        rowHeight={3 * fontSize}
        onScroll={this.listScroll}
        scrollTop={scrollTop}
        rowRenderer={({ index, key, style }) => {
          const row = rows[index];
          const items = typeof row === 'string' 
          ? <p className={styles.EmojiPickerListTitle}>{normaliseCategoryTitle(row)}</p>
          : row.map((item, i) => {
            if (item == null) return <div key={i} className={styles.EmojiPickerListItem} />;
            const { char } = item;
            return (
              <div key={char} className={styles.EmojiPickerListItem}>
                <button onClick={pickedEmoji(char)} type="button" className={styles.EmojiPickerButton}>
                  {char}
                </button>
              </div>
            );
          });
          return (
            <div key={key} style={style}>
              { items }
            </div>
          );
        }}
      />
    );

  }

  categoryButtonClick({ target }) {
    const button = thisOrParentMatches(target, `.${styles.EmojiPickerCategoryButton}`);
    if (button === false) return;
    const { changeScrollTop } = this.props;
    const category = button.getAttribute('data-category');
    const { y } = titlePositions.find(({ categoryName }) => {
      return categoryName === category;
    });
    changeScrollTop(y);
  }

  returnList() {
    const { currentCategory } = this.props;

    return (
      <div className={styles.EmojiPickerPopup}>
        <ul className={styles.EmojiPickerCategories}>
          { emojiCategories.map((category) => {
            const className = currentCategory === category
            ? `${styles.EmojiPickerCategory} ${styles['EmojiPickerCategory--active']}`
            : styles.EmojiPickerCategory;

            const icon = icons.hasOwnProperty(category)
            ? <img src={icons[category]} alt={category} />
            : category.slice(0, 1);

            return (
              <li key={category} className={className}>
                <button 
                  className={styles.EmojiPickerCategoryButton} 
                  type="button"
                  onClick={this.categoryButtonClick}
                  data-category={category}>
                  {icon}
                </button>
              </li>
            );
          }) }
        </ul>
        <div className={styles.EmojiPickerList}>
          { this.getEmojiItems() }
        </div >
      </div>
    );
  }

  render() {
    const overlayProps = {
      className: styles.EmojiPickerOverlay,
      onClick: this.props.toggleEmojiList,
    };
    return (
      <Fragment>
        <div className={styles.EmojiPicker}>
          <Button type="button" onClick={this.props.toggleEmojiList}>Emojis</Button>
          { this.props.emoji.open ? this.returnList() : null }
        </div>
        { this.props.emoji.open ? <div {...overlayProps} /> : null }
      </Fragment>
    );
  }

}


const mapStateToProps = ({ emoji }) => {
  return {
    emoji,
    currentCategory: emoji.currentCategory,
    scrollTop: emoji.scrollTop,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleEmojiList: _ => dispatch(toggleEmojiList(_)),
    changeCurrentCatgeory: _ => dispatch(changeCurrentCatgeory(_)),
    changeScrollTop: _ => dispatch(changeScrollTop(_)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmojiPicker);