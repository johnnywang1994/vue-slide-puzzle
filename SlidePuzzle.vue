<template>
  <div class="slide-puzzle" :style="puzzleStyle" :key="`pz_${puzzleKey}`">
    <div
      v-for="(id, index) in puzzleArray"
      :key="`card_${id}`"
      :style="cardStyle(id)"
      :class="[
        'card',
        { pin: id === excludeId && !gameSuccess },
        { over: gameSuccess }
      ]"
      :draggable="id !== excludeId && !gameSuccess"
      :data-id="id"
      @touchstart="onCardDragStart($event, id, index)"
      @touchmove="onTouchMove($event, id, index)"
      @touchend="onTouchEnd($event, id, index)"
      @dragstart="onCardDragStart($event, id, index)"
      @dragenter="onCardDragEnter($event, id, index)"
      @dragleave="onCardDragLeave($event, id, index)"
      @dragover="onCardDragOver($event, id, index)"
      @drop.prevent="onDropCard($event, id, index)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'SlidePuzzle',
  emits: [
    'card-dragstart',
    'card-dragenter',
    'card-dragleave',
    'card-dragover',
    'card-drop',
    'card-touchmove',
    'card-touchend'
  ],
  props: {
    ratio: {
      type: Number,
      default: 3,
      description: 'puzzle number',
    },
    steps: {
      type: Number,
      default: 5,
      description: 'puzzle shuffle steps',
    },
    puzzleStyle: {
      type: Object,
      default: () => ({
        width: '100%',
        height: '100%',
      }),
      description: 'puzzle css styles',
    },
    src: {
      type: String,
      default: 'https://static.toiimg.com/photo/72975551.cms',
      description: 'puzzle image url',
    },
    mode: {
      type: String,
      default: 'near',
      validator(value) {
        return ['near', 'far', 'free'].indexOf(value) > -1;
      },
      description: 'game rule',
    },
    randomExclude: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      puzzleKey: 0,
      puzzleArray: [],
      dragTargetId: 0,
      dragTargetIndex: 0,
      excludeId: 1, // id to exclude
      touchOverEl: null,
    };
  },
  watch: {
    src(newSrc, oldSrc) {
      if (newSrc === oldSrc) return;
      this.initPuzzle();
    },
  },
  computed: {
    allowedCardIndex() {
      const vm = this;
      const ra = vm.ratio;
      if (vm.mode === 'near') {
        const freeIdIndex = this.puzzleArray.indexOf(vm.excludeId);
        return [
          freeIdIndex+1,
          freeIdIndex-1,
          freeIdIndex+ra,
          freeIdIndex-ra,
        ].filter(i => i >= 0);
      }
      return vm.puzzleArray.map((id, index) => index);
    },
    // game status
    gameSuccess() {
      return this.puzzleArray.every((id, i) => id - 1 === i);
    },
    // Expose component states
    $state() {
      const vm = this;
      return {
        gameSuccess: vm.gameSuccess,
        allowed: vm.allowedCardIndex,
        puzzles: vm.puzzleArray,
        excludeId: vm.excludeId
      };
    },
  },
  
  methods: {
    // Init Events
    initPuzzle() {
      const vm = this;
      vm.puzzleKey = Math.random();
      vm.puzzleArray = Array(Math.pow(vm.ratio, 2)).fill().map((t, i) => i + 1);
      if (vm.randomExclude) {
        vm.excludeId = Math.ceil(Math.random() * vm.puzzleArray.length);
      }
      vm.puzzleShuffle();
    },
    // should shuffle along the game type, or user wont get success
    puzzleShuffle() {
      for (let i=0; i<this.steps; i++) {
        const allowed = this.allowedCardIndex;
        const dropIndex = this.puzzleArray.indexOf(this.excludeId);
        const randomIndex = Math.floor(Math.random() * allowed.length);
        this.exchangeIndex(allowed[randomIndex], dropIndex);
      }
      if (this.gameSuccess) {
        this.puzzleShuffle();
      }
    },
    cardStyle(id) {
      const vm = this;
      const puzzleStyle = vm.$el.getBoundingClientRect();
      const ra = vm.ratio;
      const row = Math.ceil(id / ra);
      const col = id % ra === 0 ? ra : id % ra;
      const xgap = parseInt(puzzleStyle.width) / ra;
      const ygap = parseInt(puzzleStyle.height) / ra;
      return {
        width: `${100 / ra}%`,
        background: `url('${vm.src}')`,
        backgroundSize: `${puzzleStyle.width}px auto`,
        backgroundPosition: `-${(col-1)*xgap}px -${(row-1)*ygap}px`,
      };
    },
    exchangeIndex(index1, index2) {
      const list = this.puzzleArray;
      // check exist, prevent null
      if (!list[index1] || !list[index2]) return;
      list.splice(index1,1,...list.splice(index2, 1 , list[index1]));
    },
    // Drag Events
    addAlert(node, bool = false) {
      node.style.outline = (bool || this.mode === 'free')
        ? '2px #17e000 solid'
        : '2px #ff1313 solid';
      node.style.zIndex = 1;
    },
    removeAlert(node) {
      node.style.outline = null;
      node.style.zIndex = null;
    },
    onCardDragStart(ev, id, index) {
      const vm = this;
      vm.dragTargetId = id;
      vm.dragTargetIndex = index;
      vm.$emit('card-dragstart', {event: ev, id, index, ...vm.$state});
    },
    onCardDragEnter(ev, id, index) {
      const vm = this;
      if (vm.dragTargetId === id) return;
      vm.addAlert(ev.target, id === vm.excludeId);
      vm.$emit('card-dragenter', {event: ev, id, index, ...vm.$state});
    },
    onCardDragLeave(ev, id, index) {
      const vm = this;
      vm.removeAlert(ev.target);
      vm.$emit('card-dragleave', {event: ev, id, index, ...vm.$state});
    },
    onCardDragOver(ev, id, index) {
      const vm = this;
      ev.preventDefault();
      vm.$emit('card-dragover', {event: ev, id, index, ...vm.$state});
    },
    onDropCard(ev, dropId, index) {
      const vm = this;
      const notAllowed = vm.allowedCardIndex.indexOf(vm.dragTargetIndex) < 0;
      vm.removeAlert(ev.target);
      if (vm.mode !== 'free') {
        if (dropId !== vm.excludeId || notAllowed) return;
      }
      // exchange id in list => vue rerender puzzle
      vm.exchangeIndex(index, vm.dragTargetIndex);
      vm.$emit('card-drop', {event: ev, id: dropId, index, ...vm.$state});
    },
    onTouchMove(ev) {
      const vm = this;
      if (vm.gameSuccess) return;
      const { pageX, pageY } = ev.touches[0];
      const overEl = document.elementFromPoint(pageX, pageY);
      const overId = overEl.dataset.id;
      if (vm.dragTargetId === overId) return;
      if (overEl !== vm.touchOverEl) {
        vm.touchOverEl && vm.removeAlert(vm.touchOverEl);
        vm.touchOverEl = overEl;
      }
      vm.addAlert(overEl, overId == vm.excludeId);
      vm.$emit('card-touchmove', {event: ev, el: overEl, ...vm.$state});
    },
    onTouchEnd(ev) {
      const vm = this;
      if (!vm.touchOverEl) return;
      const dropId = Number(vm.touchOverEl.dataset.id);
      const notAllowed = vm.allowedCardIndex.indexOf(vm.dragTargetIndex) < 0;
      vm.removeAlert(vm.touchOverEl);
      if (vm.mode !== 'free') {
        if (dropId !== vm.excludeId || notAllowed) return;
      }
      const dropIndex = vm.puzzleArray.indexOf(dropId);
      vm.exchangeIndex(dropIndex, vm.dragTargetIndex);
      vm.$emit('card-touchend', {event: ev, id: dropId, ...vm.$state});
      // clear over el
      vm.touchOverEl = null;
    },
  },
  
  mounted() {
    this.initPuzzle();
  },
}
</script>

<style lang="scss">
.slide-puzzle {
  display: flex;
  flex-wrap: wrap;
  background: #000;
  .card {
    box-sizing: border-box;
    background-repeat: no-repeat;
    transition: transform 0.2s;
    &.pin {
      background: transparent !important;
    }
    &:not(.pin):not(.over):hover {
      transform: scale(1.05);
      cursor: pointer;
    }
  }
}
</style>
