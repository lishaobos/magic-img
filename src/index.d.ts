import { install } from './magic'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type MagicImg = ReturnType<typeof install>

declare global {
    interface HTMLElementTagNameMap {
        "magic-img": MagicImg;
    }
    namespace JSX {
        interface IntrinsicElements {
            "magic-img": DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & Partial<{
                src: string
            }>;
        }
    }
}
