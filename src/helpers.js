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

// https://stackoverflow.com/questions/34057127/how-to-transfer-large-objects-using-postmessage-of-webworker
export const convertObjectToArrayBuffer = (obj) => {
  const string = JSON.stringify(obj);
  const { buffer } = new TextEncoder(document.characterSet.toLowerCase()).encode(string);
  return buffer;
}

// https://stackoverflow.com/questions/34057127/how-to-transfer-large-objects-using-postmessage-of-webworker
export const arrayBufferToObject = (arrayBuffer) => {
  const { buffer } = new Uint8Array(arrayBuffer);
  const decoder = new TextDecoder('utf-8');
  const view = new DataView(buffer, 0, buffer.byteLength);
  const string = decoder.decode(view);
  return JSON.parse(string);
}

export const arrayBufferConcat = (arrayBuffer, oldArrayBuffer, start) => {
  for (let i = 0; i < oldArrayBuffer.byteLength; i++) {
    arrayBuffer[i + start] = oldArrayBuffer[i];
  }
}