# magic-img

让图片的加载更加优雅

## [在线示例](https://lishaobos.github.io/magic-img)


## Before

<img src='https://github.com/lishaobos/magic-img/blob/main/before.gif?raw=true'>

## After

<img src='https://github.com/lishaobos/magic-img/blob/main/magic-img.gif?raw=true'>

## 特性

- 无框架限制 - 基于 [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- 懒加载 - 基于 [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- 模式
  - Blurhash - 模糊算法生成占位图
  - Lqip - 以缩略 base64 图为过渡
  - Sqip - 以 svg 轮廓为过渡，可自定义轮廓，滤镜
  - Cucoloris - 以剪影为过渡，可自定义颜色，背景色
  - Draw - 以动态画笔为过渡，可自定义画笔颜色
- 支持 - jpg，jpeg，png，gif，webp
- [自定义过渡](#自定义过渡)
- 集成
  - [Vite](#options)

## 行为模式

你可能会看到图片首次加载之后，再次加载几乎看不到过渡动画，这是有意为之的，我们解决的是图片加载过程中的留白，但通常图片访问后会被浏览器缓存，再次访问就不需要加载过渡动画来浪费时间。当然不用担心的是如果你的图片没有使用缓存策略，依旧会加载过渡动画。



## 安装

```js
npm install magic-img
```

## 使用方式

### Web Component

使用 Web Component 好处是无技术栈限制，缺点是 ssr 不友好。

```js
// main.js
import installMagicImg from 'magic-img'
import 'magic-img/css'

installMagicImg()
```


```js
// vue
<magic-img :src='img'>
// react
<magic-img src={ img }>
// ... 其他技术栈

// magic = lqip|sqip|cucoloris|draw
import img from './home.png?magic=lqip'
// 可拼接参数
import img from './home.png?magic=sqip&numberOfPrimitives=100&blur=0'
```

---

针对 SSR 需求，可以不使用 web components，有以下框架集成（持续增加中。。。）。

### Vue2.7+，3

```js
import 'magic-img/css'
import MagicImg from 'magic-img/vue2'
// import MagicImg from 'magic-img/vue3' // vue3

Vue.use(MagicImg)
```

```js
<MagicImg :src='img' />

// magic = lqip|sqip|cucoloris|draw
import img from './home.png?magic=lqip'
// 可拼接参数
import img from './home.png?magic=sqip&numberOfPrimitives=100&blur=0'
```
---

### React >= 16.18

```js
import 'magic-img/css'
import MagicImg from 'magic-img/react'
```

```js
<MagicImg src={img} />

// magic = lqip|sqip|cucoloris|draw
import img from './home.png?magic=lqip'
// 可拼接参数
import img from './home.png?magic=sqip&numberOfPrimitives=100&blur=0'
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
  - w (number) - 缩略图宽度(指的是压缩的宽度值，不是实际展示)
    (default: 20)
  - h (number) - 缩略图高度
  - componentX (number)
    (default: 4)
  - componentY (number)
    (default: 4)
  - punch (number) - 对比度
  - hash (string) - 自定义 hash，默认取自图片
- lqip
  - w (number) - 缩略图宽度
    (default: 20)
  - h (number) - 缩略图高度
- sqip
  - numberOfPrimitives (number) - 生成的轮廓数量
    (default: 20)
  - blur (number) - 滤镜
    (default: 2)
  - mode (number) - 轮廓模式
    (default: 0)
    0=combo, 1=triangle, 2=rect, 3=ellipse, 4=circle, 5=rotatedrect, 6=beziers, 7=rotatedellipse, 8=polygon
- cucoloris
  - background (string) - 背景色
    (default: '#fff')
  - color (string) - c7d4d8
    (default: '#c7d4d8')
  - threshold (number) - 阈值
    (default: 120)
- draw
  - w (number) - 缩略图宽度
    (default: 400)
  - h (number) - 缩略图高度


## 自定义 Options

#### 全局定义

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

## 自定义过渡

根据不同状态你可以自定义过渡效果

#### migic-img dom 结构

```html
<magic-img>
  <!-- 占位元素，可能是 img，svg -->
  <placeholder class='magic-placeholder' />
  <!-- 最终展示图片 -->
  <target class='magic-target' />
</magic-img>
```

#### 过渡状态

- default - 你可以默认一些样式
- from - 当元素出现在视窗内，此时也会加载真正的图片
  placeholder，target 会被设置属性 status=from
- to - 真正的图片加载完毕
  placeholder，target 会被设置属性 status=to

#### 例子

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

## 注意

在 vue 中，custom element 需要注册

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