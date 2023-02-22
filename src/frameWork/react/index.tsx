import React, { useEffect, useRef, useState } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
	src: string,
}

export default function MagicImg ({ src, ...reset }: Props) {
	const magicImage = useRef(null)
	const data = JSON.parse(src) as {
		src: string
		magic: string
		content: string
		width: number
		height: number
		width_: number
		height_: number
	}
	const [placeholderStatus, setPlaceholderStatus] = useState('')
	const [targetStatus, setTargetStatus] = useState('')
	const [realSrc, setRealSrc] = useState('')

	const start = () =>{
		setPlaceholderStatus('from')
		setTargetStatus('from')
		const start = performance.now()
		const img = new Image()
		img.onload = () => requestAnimationFrame(() => {
			const status = performance.now() - start > 100 ? 'to' : 'noPrevice'
			setRealSrc(data.src)
			setPlaceholderStatus(status)
			setTargetStatus(status)
		})
	
		img.src = data.src
	}

	useEffect(() => {
		const intersection = new IntersectionObserver(async (entrys) => {
			for (const { isIntersecting } of entrys) {
				if (isIntersecting) {
					start()
					intersection.disconnect()
				}
			}
		})
		intersection.observe(magicImage.current)

		return () => {
			intersection.disconnect()
		}
	}, [src])

	return (
		<div ref={magicImage} magic-img='true' {...{magic: data.magic, ...reset}}>
			{
				data.magic !== 'lqip' ?
					<svg 
						className={'magic-placeholder'}
						{...{status: placeholderStatus}}
						preserveAspectRatio='none'
						dangerouslySetInnerHTML={{__html: data.content}}
						width={data.width}
						height={data.height}
						viewBox={`0 0 ${data.width_ || data.width} ${data.height_ || data.height}`}
					></svg> :
					<img 
						className={'magic-placeholder' }
						{...{status: placeholderStatus}}
						src={data.content}
						width={data.width}
						height={data.height}
						alt=""
					/>
			}

			<img 
				className={'magic-target'}
				{...{status:targetStatus}}
				src={realSrc}
				alt="" 
			/>
		</div>
	)
}