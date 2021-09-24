import VueSlidePuzzle from './components/SlidePuzzle.vue';

const install = function (Vue) {
  Vue.component('VueSlidePuzzle', VueSlidePuzzle);
}

export {
  install,
  VueSlidePuzzle,
}

export default {
  install
}