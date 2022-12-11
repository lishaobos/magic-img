const wait = (time = 0) => new Promise((r) => setTimeout(r, time))

export function install() {
  class MagicImg extends HTMLElement {
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
      magic?: string
      src?: string
      content?: string
      width?: string
      height?: string
      width_?: string
      height_?: string
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
        this.smallImg.setAttribute('width', data.width)
        this.smallImg.setAttribute('height', data.height)
        this.appendChild(this.smallImg)
      } else {
        this.svg.setAttribute('width', data.width)
        this.svg.setAttribute('height', data.height)
        this.svg.setAttribute('viewBox', `0 0 ${data.width_ || data.width} ${data.height_ || data.height}`)
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
  
      requestAnimationFrame(() => {
        this.svg.setAttribute('status', 'from')
        this.smallImg.setAttribute('status', 'from')
        this.img.setAttribute('status', 'from')
        const start = performance.now()
        this.img.onload = () => {
          const to = () => requestAnimationFrame(() => {
            this.svg.setAttribute('status', 'to')
            this.smallImg.setAttribute('status', 'to')
            this.img.setAttribute('status', 'to')
          })
  
          if (performance.now() - start < 600) {
            return setTimeout(to, 600 - (performance.now() - start))
          }
  
          to()
        }
        this.img.src = data.src
      })
    }
  
    static get observedAttributes() {
      return ['src']
    }
  
    async attributeChangedCallback() {
      if (!this.initial) return
  
      await this.start(true)
    }
  }
  
  customElements.define('magic-img', MagicImg)
}
