import { TOGGLE_EMOJI_LIST, EMOJI_CHANGE_PAGE } from '../constants';

const defaultState = {
  open: false,
  recent: [], // last 10 recently used items
  page: 0,
  currentCategory: false, // false means all
  knownCategories: [
    'people',
    'animals_and_nature',
    'food_and_drink',
    'activity',
    'travel_and_places',
    'objects',
    'flags',
    'symbols',
  ],
};


const emoji = (state = defaultState, action) => {

  switch (action.type) {

    case TOGGLE_EMOJI_LIST:
      return { ...state, open: !state.open };

    case EMOJI_CHANGE_PAGE:
      return { ...state, page: action.page };

    default:
      return state;

  }

}


export default emoji;