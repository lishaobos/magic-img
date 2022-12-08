# magic-img

让图片的加载更加优雅

## [在线示例](https://github.com/lishaobos/magic-img/blob/main/magic-img.gif?raw=true)

## 效果

<img src='./magic-img.gif'>

## 特性

- 无框架限制 - 基于 [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- 懒加载 - 基于 [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
- 模式
  - Lqip - 以缩略 base64 图为过渡
  - Sqip - 以 svg 轮廓为过渡，可自定义轮廓，滤镜
  - Cucoloris - 以剪影为过渡，可自定义颜色，背景色
  - Draw - 以动态画笔为过渡，可自定义画笔颜色
- 支持 - jpg，jpeg，png，gif
- [自定义过渡](#自定义过渡)
- 集成
  - [Vite](#options)

## 安装

```js
npm install magic-img
```

## 使用

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

// magic = lqip|sqip|cucoloris|draw
import img from './home.png?magic=lqip'
```

```js
// vite.config.js
import magicImg from 'magic-img/vite';

export default {
  plugins: [
    magicImg(/* options */)
  ]
}
```

## Options

- lqip
  - w - 缩略图宽度
    (default: 20)
  - h - 缩略图高度
- sqip
  - numberOfPrimitives - 生成的轮廓数量
    (default: 20)
  - blur - 滤镜
    (default: 2)
  - mode - 轮廓模式
    (default: 0)
    0=combo, 1=triangle, 2=rect, 3=ellipse, 4=circle, 5=rotatedrect, 6=beziers, 7=rotatedellipse, 8=polygon
- cucoloris
  - background - 背景色
    (default: '#fff')
  - color - c7d4d8
    (default: '#c7d4d8')
  - threshold - 阈值
    (default: 120)
- draw
  - w - 缩略图宽度
    (default: 400)
  - h - 缩略图高度


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

#### 局部定义

```js
// 可针对不同图片自定义转换模式
import img from './home.png?magic=sqip&numberOfPrimitives=100&blur=0'
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