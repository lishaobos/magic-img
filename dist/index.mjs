// src/magic.ts
var wait = (time = 0) => new Promise((r) => setTimeout(r, time));
function install() {
  try {
    class MagicImg extends HTMLElement {
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
          const src = this.getAttribute("src") || this.src;
          return JSON.parse(src);
        } catch (e) {
          console.log("src attribute error", e);
          return {};
        }
      }
      async connectedCallback() {
        this.initial = true;
        if (!this.getAttribute("src") && !this.src)
          throw new Error("<magic-img /> src attribute is required\uFF0Csee\uFF1Ahttps://github.com/lishaobos/magic-img#%E4%BD%BF%E7%94%A8");
        this.setPlaceholder();
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
      setPlaceholder() {
        const { data } = this;
        this.setAttribute("magic", data.magic);
        this.img.removeAttribute("status");
        if (data.magic === "lqip") {
          this.smallImg.src = data.content;
          this.smallImg.setAttribute("width", data.width);
          this.smallImg.setAttribute("height", data.height);
          this.svg.parentNode?.removeChild(this.svg);
          this.appendChild(this.smallImg);
        } else {
          this.svg.setAttribute("width", data.width);
          this.svg.setAttribute("height", data.height);
          this.svg.setAttribute("viewBox", `0 0 ${data.width_ || data.width} ${data.height_ || data.height}`);
          this.svg.innerHTML = data.content;
          this.smallImg.parentNode?.removeChild(this.smallImg);
          this.appendChild(this.svg);
        }
      }
      async start() {
        const { data } = this;
        requestAnimationFrame(() => {
          this.svg.setAttribute("status", "from");
          this.smallImg.setAttribute("status", "from");
          this.img.setAttribute("status", "from");
          const start = performance.now();
          this.img.onload = () => {
            const to = () => requestAnimationFrame(() => {
              this.svg.setAttribute("status", "to");
              this.smallImg.setAttribute("status", "to");
              this.img.setAttribute("status", "to");
            });
            if (performance.now() - start < 600) {
              return setTimeout(to, 600 - (performance.now() - start));
            }
            to();
          };
          this.img.src = data.src;
        });
      }
      static get observedAttributes() {
        return ["src"];
      }
      async attributeChangedCallback() {
        if (!this.initial)
          return;
        this.setPlaceholder();
        await wait();
        await this.start();
      }
    }
    customElements.define("magic-img", MagicImg);
  } catch {
    console.log("is not in browser env, skip magic-img setup.");
  }
  customElements.define("magic-img", MagicImg);
}

// src/index.ts
var src_default = install;
export {
  src_default as default
};
