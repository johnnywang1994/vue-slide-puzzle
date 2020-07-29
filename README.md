# vue-slide-puzzle

A vue component to create a slide puzzle game, be aware that this plugin need to install sass related loader.


## Install

``` bash
npm install vue-slide-puzzle
// or
yarn add vue-slide-puzzle
```

import component

```js
import SlidePuzzle from 'vue-slide-puzzle';

export default {
  components: {
    SlidePuzzle
  }
};
```


## Usage

```html
<template>
  <div id="app">
    <div style="width: 400px;height: 300px;">
      <slide-puzzle :ratio="3" mode="near" />
    </div>
  </div>
</template>

<script>
import SlidePuzzle from 'vue-slide-puzzle';

export default {
  components: {
    SlidePuzzle,
  },
};
</script>
```


## Props

### ratio

puzzle number(default: 3^2 => 9)

  - type: `Number`
  - default: 3


### steps

puzzle init shuffle steps

  - type: `Number`
  - default: 5


### puzzleStyle

puzzle wrapper css styles

  - type: `Object`
  - default:
  ```json
  {
    "width": "100%",
    "height": "100%",
  }
  ```


### src

puzzle image url

  - type: `String`
  - default: `https://static.toiimg.com/photo/72975551.cms`


### mode

puzzle move mode

  - type: `String`
  - default: `near`
  - allowed values: `near`, `far`, `free`


### randomExclude

if the excluded puzzle should be random

  - type: `Boolean`
  - default: `false`(default is first puzzle get excluded)


## Events

Here is the events list, each will be trigger after the plugin.

```js
emits: [
  'card-dragstart',
  'card-dragenter',
  'card-dragleave',
  'card-dragover',
  'card-drop',
  'card-touchmove',
  'card-touchend'
]
```

### event demo

If we want to count the user's steps, we can use `card-drop` and `card-touchend`, which will only trigger after the plugin check.

```html
<template>
  <div id="app">
    <p>User steps count: {{ count }}</p>
    <div style="width: 400px;height: 300px;">
      <slide-puzzle
        :ratio="3"
        mode="near"
        @card-drop="onUserMoved"
        @card-touchend="onUserMoved"
      />
    </div>
  </div>
</template>

<script>
import SlidePuzzle from 'vue-slide-puzzle';

export default {
  components: {
    SlidePuzzle,
  },
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    onUserMoved() {
      this.count++;
    },
  },
};
</script>
```


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2020-present, Johnny Wang
