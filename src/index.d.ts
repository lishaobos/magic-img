export { install as default } from './magic'
import type { Magic } from './magic'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

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