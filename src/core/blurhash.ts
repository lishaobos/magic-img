import jimp from 'jimp'
import { encode, decode } from 'blurhash'
import UPNG from 'upng-js'
import { encode as encode64 } from 'base64-arraybuffer'
import type { BlurhashOptions } from './type'

export default async function (filePath: string, params: BlurhashOptions) {
	const { 
		w = 20,
		h = jimp.AUTO,
		componentX = 4,
		componentY = 4,
		punch,
		hash: defaultHash
	} = params
	const image = await jimp.read(filePath)
	const width = image.getWidth()
	const height = image.getHeight()
	const img = image.resize(+w, +h)
	const nw = img.getWidth()
	const nh = img.getHeight()
	const hash = defaultHash || encode(Uint8ClampedArray.from(img.bitmap.data), nw, nh, componentX, componentY)
	const bitmap = decode(hash, nw, nh, punch)
	const png = UPNG.encode([bitmap], nw, nh, 256)
	const content = `data:image/png;base64,${encode64(png)}`
  
	return {
		width,
		height,
		content
	}
}