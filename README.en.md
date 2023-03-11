# magic-img

## [English](./README.en.md) | [简体中文](./README.md)

Make img loading more elegant

## [demo](https://lishaobos.github.io/magic-img)


## Before

<img src='https://github.com/lishaobos/magic-img/blob/main/before.gif?raw=true'>

## After

<img src='https://github.com/lishaobos/magic-img/blob/main/magic-img.gif?raw=true'>

## Feature

- no framework limitations - base on [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- lazy load - base on [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- [support load remote url](#Load_Methods)
- mode
  - blurhash - blurred algorithm generates placeholder image
  - lqip - transition based on thumbnail base64 image
  - sqip - transition based on SVG outline, with customizable outline and filters
  - cucoloris - transition with silhouette, customizable color and background color
  - draw - transition with a dynamic brush, customizable brush color
- support - jpg，jpeg，png，gif，webp
- [custom duration](#custom duration)
- integration
  - [Vite](#Vite)
  - [Webpack](#Webpack)

## Behavior

You may notice that after the first load of the image, the transition animation is hardly visible on subsequent loads. This is intentional, as we are addressing the issue of white space during image loading. However, typically the image is cached by the browser after the initial load, so there is no need to waste time loading the transition animation again on subsequent visits. If your images do not use caching policies, the transition animation will still be loaded.



## Install

```js
npm install magic-img
```

## Useage

### Load_Methods

```js
// magic = blurhash|lqip|sqip|cucoloris|draw
import img from './home.png?magic=lqip'

// 可拼接参数
import img from './home.png?magic=sqip&numberOfPrimitives=100&blur=0'

// 加载远程链接
import img from 'magic-img@https://cdn.pixabay.com/photo/2013/07/18/20/26/sea-164989__480.jpg?magic=lqip'
```

### Web Component

Web component is good at across framework, but not good at ssr

```js
// main.js
import installMagicImg from 'magic-img'
import 'magic-img/css'

installMagicImg()
```

```html
// vue
<magic-img :src='img'>
// react
<magic-img src={ img }>
// ... 其他技术栈
```

---

For SSR needs, you can avoid using web components and use one of the following frameworks (list is continuously growing...)

### Vue2.7+，3

```js
import 'magic-img/css'
import MagicImg from 'magic-img/vue2'
// import MagicImg from 'magic-img/vue3' // vue3

Vue.use(MagicImg)
```

```html
<MagicImg :src='img' />
```
---

### React >= 16.18

```js
import 'magic-img/css'
import MagicImg from 'magic-img/react'
```

```html
<MagicImg :src='img' />
```
---


### Vite
```js
// vite.config.js
import magicImg from 'magic-img/vite';

export default {
  plugins: [
    magicImg(/* options */)
  ]
}
```

### Webpack
```js
// webpack.config.js
const magicImg = require('magic-img/webpack').default;

module.exports = {
  plugins: [
    magicImg(/* options */)
  ]
}
```

## Options

- blurhash
  - w (number) - thumbnail width(this refers to the compressed width value, not the actual display)
    (default: 20)
  - h (number) - thumbnail height
  - componentX (number)
    (default: 4)
  - componentY (number)
    (default: 4)
  - punch (number) - contrast ratio
  - hash (string) - custom hash，default by img
- lqip
  - w (number) - thumbnail width
    (default: 20)
  - h (number) - thumbnail height
- sqip
  - numberOfPrimitives (number) - the number of generated outlines
    (default: 20)
  - blur (number)
    (default: 2)
  - mode (number)
    (default: 0)
    0=combo, 1=triangle, 2=rect, 3=ellipse, 4=circle, 5=rotatedrect, 6=beziers, 7=rotatedellipse, 8=polygon
- cucoloris
  - background (string)
    (default: '#fff')
  - color (string)
    (default: '#c7d4d8')
  - threshold (number) - threshold
    (default: 120)
- draw
  - w (number) - thumbnail width
    (default: 400)
  - h (number) - thumbnail height


## Custom Options

#### Global Options

```js
// vite.config.js
import magicImg from 'magic-img/vite';

export default {
  plugins: [
    magicImg({
      sqip: {
        numberOfPrimitives: 100,
        blur: 0,
      }
    })
  ]
}
```

## Custom Duration

you can custom animation duration

#### migic-img dom construction

```html
<magic-img>
  <!-- 占位元素，可能是 img，svg -->
  <placeholder class='magic-placeholder' />
  <!-- 最终展示图片 -->
  <target class='magic-target' />
</magic-img>
```

#### Duration

- default - default style
- from - when el inside window
  placeholder，target will be set status=from
- to - img is loaded
  placeholder，target will be set status=to

#### Example

```html
<magic-img src='xxx' class='my-style'>
```

```css
.my-style .magic-placeholder {
  filter: blur(10px)
}
.my-style .magic-target[status=from] {
  border: 1px solid;
}
.my-style .magic-target[status=to] {
  opacity: 1;
  filter: grayscale(1);
  transition: all 4s;
}
```

## Notice

in vue, custom element need registry

#### Vue2
```js
Vue.config.ignoredElements = [
  'magic-img',
]
```

#### Vue3 + Vite
```js
// vite.config.js
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('magic-img')
        }
      }
    })
  ]
}
```

#### Vue3 + Vue-cli
```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: tag => tag.startsWith('magic-img')
        }
      }))
  }
}
```