// src/magic.ts
var wait = (time = 0) => new Promise((r) => setTimeout(r, time));
var MagicImg = class extends HTMLElement {
  initial = false;
  width = 0;
  height = 0;
  src = "";
  content = "";
  svg;
  img;
  smallImg;
  constructor() {
    super();
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("preserveAspectRatio", "none");
    this.img = new Image();
    this.smallImg = new Image();
    this.svg.classList.add("magic-placeholder");
    this.smallImg.classList.add("magic-placeholder");
    this.img.classList.add("magic-target");
  }
  get data() {
    try {
      return JSON.parse(this.getAttribute("src"));
    } catch (e) {
      console.log("\u53C2\u6570\u83B7\u53D6\u5931\u8D25", e);
      return {};
    }
  }
  async connectedCallback() {
    this.initial = true;
    if (!this.getAttribute("src"))
      throw new Error("\u9700\u8981 src");
    const { data } = this;
    this.setAttribute("magic", data.magic);
    if (data.magic === "lqip") {
      this.smallImg.src = data.content;
      this.appendChild(this.smallImg);
    } else {
      this.svg.setAttribute("viewBox", `0 0 ${data.width} ${data.height}`);
      this.svg.innerHTML = data.content;
      this.appendChild(this.svg);
    }
    this.appendChild(this.img);
    const intersection = new IntersectionObserver(async (entrys) => {
      for (const { isIntersecting } of entrys) {
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
    const { data } = this;
    if (isUrlChange) {
      this.svg.setAttribute("viewBox", `0 .width} ${data.height}`);
      this.svg.innerHTML = data.content;
      this.img.removeAttribute("status");
      this.svg.removeAttribute("status");
      await wait();
    }
    this.svg.setAttribute("status", "from");
    this.smallImg.setAttribute("status", "from");
    this.img.setAttribute("status", "from");
    const start = performance.now();
    this.img.onload = () => {
      if (performance.now() - start < 1e3) {
        return setTimeout(() => {
          this.img.setAttribute("status", "to");
        }, 1e3 - (performance.now() - start));
      }
      this.img.setAttribute("status", "to");
    };
    this.img.src = data.src;
  }
  static get observedAttributes() {
    return ["src"];
  }
  async attributeChangedCallback() {
    if (!this.initial)
      return;
    await this.start(true);
  }
};
function install() {
  customElements.define("magic-img", MagicImg);
}

// src/index.ts
var src_default = install;
export {
  src_default as default
};
