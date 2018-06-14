import {
  TOGGLE_EMOJI_LIST,
  EMOJI_CHANGE_CURRENT_CATEGORY,
  EMOJI_CHANGE_SCROLL_TOP,
} from '../constants';

const defaultState = {
  open: false,
  recent: [], // last X recently used items
  currentCategory: 'people',
  scrollTop: 0,
};


const emoji = (state = defaultState, action) => {

  switch (action.type) {

    case TOGGLE_EMOJI_LIST: {
      return { ...state, open: !state.open };
    }

    case EMOJI_CHANGE_CURRENT_CATEGORY: {
      return { ...state, currentCategory: action.category };
    }

    case EMOJI_CHANGE_SCROLL_TOP: {
      return { ...state, scrollTop: action.scrollTop };
    }


    default:
      return state;

  }

}


export default emoji;