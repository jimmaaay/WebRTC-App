import {
  TOGGLE_EMOJI_LIST,
  EMOJI_CHANGE_PAGE,
} from '../constants';

export const toggleEmojiList = () => {
  return {
    type: TOGGLE_EMOJI_LIST, 
  };
};

export const changeEmojiPage = (page) => {
  return {
    page,
    type: EMOJI_CHANGE_PAGE,
  };
};