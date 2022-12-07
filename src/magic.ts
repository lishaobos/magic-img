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
    this.img = new Image()
    this.smallImg = new Image()
    this.svg.classList.add('magic-placeholder')
    this.smallImg.classList.add('magic-placeholder')
    this.img.classList.add('magic-target')
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
      this.img.removeAttribute('status')
      this.svg.removeAttribute('status')
      await wait()
    }

    this.svg.setAttribute('status', 'from')
    this.smallImg.setAttribute('status', 'from')
    this.img.setAttribute('status', 'from')
    const start = performance.now()
    this.img.onload = () => {
      if (performance.now() - start < 1000) {
        return setTimeout(() => {
          this.img.setAttribute('status', 'to')
        }, 1000 - (performance.now() - start))
      }
      this.img.setAttribute('status', 'to')
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
