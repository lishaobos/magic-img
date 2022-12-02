const wait = (time = 0) => new Promise((r) => setTimeout(r, time));
class Draw extends HTMLElement {
  constructor() {
    super();
    this.initial = false;
    this.width = 0;
    this.height = 0;
    this.src = "";
    this.content = "";
    this.data = {
      src: "",
      content: "",
      width: "",
      height: ""
    };
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("preserveAspectRatio", "none");
    this.svg.classList.add("active-draw-svg");
    this.img = new Image();
    this.img.classList.add("active-draw-img");
  }
  async connectedCallback() {
    this.initial = true;
    if (!this.getAttribute("src"))
      throw new Error("\u9700\u8981 src");
    try {
      this.data = JSON.parse(this.getAttribute("src"));
    } catch (e) {
      console.log(e);
    }
    this.style.display = "inline-block";
    this.style.position = "relative";
    this.svg.setAttribute("viewBox", `0 0 ${this.data.width} ${this.data.height}`);
    this.svg.innerHTML = this.data.content;
    this.appendChild(this.img);
    this.appendChild(this.svg);
    const intersection = new IntersectionObserver(async (entrys) => {
      for (const { isIntersecting } of entrys) {
        console.log('initial:""""', isIntersecting, entrys);
        if (isIntersecting) {
          await this.start();
          intersection.unobserve(this);
          intersection.disconnect();
        }
      }
    });
    intersection.observe(this);
  }
  async start(isUrlChange = false) {
    if (isUrlChange) {
      try {
        this.data = JSON.parse(this.getAttribute("src"));
        this.svg.setAttribute("viewBox", `0 0 ${this.data.width} ${this.data.height}`);
        this.svg.innerHTML = this.data.content;
        this.img.classList.remove("active-draw-img-active");
        this.svg.classList.remove("active-draw-svg-active");
        await wait();
      } catch (e) {
        console.log(e);
      }
    }
    this.svg.classList.add("active-draw-svg-active");
    this.img.onload = () => {
      setTimeout(() => {
        this.img.classList.add("active-draw-img-active");
      }, 4e3);
    };
    this.img.src = this.data.src;
  }
  static get observedAttributes() {
    return ["src"];
  }
  async attributeChangedCallback() {
    if (!this.initial)
      return;
    await this.start(true);
  }
}
function install$1() {
  customElements.define("active-img-draw", Draw);
}

function install() {
  install$1();
}

export { install as default };
