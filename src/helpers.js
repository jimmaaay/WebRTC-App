export const thisOrParentMatches = (e, selector) => {
  let el = e;
  while(! el.matches(selector)) {
    el = el.parentElement;
    if (el == null) {
      el = false;
      break;
    }
  }
  return el;
}