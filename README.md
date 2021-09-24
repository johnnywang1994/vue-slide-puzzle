# vue-slide-puzzle

A vue component to create a slide puzzle game, be aware that this plugin need to install sass related loader.

> Mobile touch events supported.

> See [Live Demo](https://johnnywang1994.github.io/slide-puzzle)


## Install

``` bash
npm install vue-slide-puzzle
// or
yarn add vue-slide-puzzle
```

import component

```js
import { VueSlidePuzzle } from 'vue-slide-puzzle';

export default {
  components: {
    VueSlidePuzzle
  }
};
```


## Usage

```html
<template>
  <div id="app">
    <!-- Give a wrapper to set width, height for puzzle -->
    <div style="width: 400px;height: 300px;">
      <slide-puzzle :ratio="3" mode="near" />
    </div>
  </div>
</template>

<script>
import { VueSlidePuzzle } from 'vue-slide-puzzle';

export default {
  components: {
    VueSlidePuzzle
  }
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

puzzle image url, will be `watched` inside the component once changed value. So could be used to rerender the puzzle. See [Live Demo Source Code](https://github.com/johnnywang1994/slide-puzzle)

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
import { VueSlidePuzzle } from 'vue-slide-puzzle';

export default {
  components: {
    VueSlidePuzzle
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
