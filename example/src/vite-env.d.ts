/// <reference types="vite/client" />
/// <reference types="magic-img/global" />

declare namespace JSX {
  interface IntrinsicElements {
    'magic-img': DetailedHTMLFactory<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
  }
}