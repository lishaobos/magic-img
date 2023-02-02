import { DetailedHTMLProps, HTMLAttributes } from 'react'

type Magic = {
	initial: boolean;
	width: number;
	height: number;
	src: string;
	content: string;
	svg: SVGSVGElement;
	img: HTMLImageElement;
	smallImg: HTMLImageElement;
}
declare function install(): void

declare global {
	interface HTMLElementTagNameMap {
		"magic-img": HTMLDivElement & Partial<Magic>
	}
	namespace JSX {
		interface IntrinsicElements {
			"magic-img": DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & Partial<Magic>;
		}
	}
}

export { install as default }
