import runtime from 'serviceworker-webpack-plugin/lib/runtime';

export default () => {

  if ('serviceWorker' in navigator) {
    runtime.register();
  }

}
