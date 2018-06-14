import {
  TOGGLE_EMOJI_LIST,
  EMOJI_CHANGE_CURRENT_CATEGORY,
  EMOJI_CHANGE_SCROLL_TOP,
} from '../constants';

export const toggleEmojiList = () => {
  return {
    type: TOGGLE_EMOJI_LIST, 
  };
}

export const changeCurrentCatgeory = (category) => {
  return {
    category,
    type: EMOJI_CHANGE_CURRENT_CATEGORY,
  };
}

export const changeScrollTop = (scrollTop) => {
  return {
    scrollTop,
    type: EMOJI_CHANGE_SCROLL_TOP,
  };
}