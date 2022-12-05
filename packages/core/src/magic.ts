const wait = (time = 0) => new Promise((r) => setTimeout(r, time))

export class MagicImg extends HTMLElement {
  initial = false
  width = 0
  height = 0
  src = ''
  content = ''
  svg: SVGSVGElement
  img: HTMLImageElement
  smallImg: HTMLImageElement

  constructor() {
    super()

    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.setAttribute('preserveAspectRatio', 'none')
    this.svg.classList.add('active-draw-svg')
    this.img = new Image()
    this.img.classList.add('active-draw-img')
    this.smallImg = new Image()
    this.smallImg.classList.add('active-draw-small')
  }

  get data(): {
    magic?: string,
    src?: string,
    content?: string,
    width?: string,
    height?: string,
  } {
    try {
      return JSON.parse(this.getAttribute('src'))
    } catch (e) {
      console.log('参数获取失败', e)
      return {}
    }
  }

  async connectedCallback() {
    this.initial = true
    if (!this.getAttribute('src')) throw new Error('需要 src')

    const { data } = this
    this.setAttribute('magic', data.magic)
    this.style.display = 'inline-block'
    this.style.position = 'relative'
    if (data.magic === 'lqip') {
      this.smallImg.src = data.content
      this.appendChild(this.smallImg)
    } else {
      this.svg.setAttribute('viewBox', `0 0 ${data.width} ${data.height}`)
      this.svg.innerHTML = data.content
      this.appendChild(this.svg)
    }
    this.appendChild(this.img)
    const intersection = new IntersectionObserver(async (entrys) => {
      for (const { isIntersecting } of entrys) {
        if (isIntersecting) {
          await this.start()
          intersection.unobserve(this)
          intersection.disconnect()
        }
      }
    })
    intersection.observe(this)
  }

  async start(isUrlChange = false) {
    const { data } = this
    if (isUrlChange) {
      this.svg.setAttribute('viewBox', `0 .width} ${data.height}`)
      this.svg.innerHTML = data.content
      this.img.classList.remove('active-draw-img-active')
      this.svg.classList.remove('active-draw-svg-active')
      await wait()
    }

    this.svg.classList.add('active-draw-svg-active')
    const start = performance.now()
    this.img.onload = () => {
      if (performance.now() - start < 500) {
        return setTimeout(() => {
          this.img.classList.add('active-draw-img-active')
        }, 1e3)
      }
      this.img.classList.add('active-draw-img-active')
    }
    this.img.src = data.src
  }

  static get observedAttributes() {
    return ['src']
  }

  async attributeChangedCallback() {
    if (!this.initial) return

    await this.start(true)
  }
}

export function install() {
  customElements.define('magic-img', MagicImg)
}
