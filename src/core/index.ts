import type { Options } from './type'
import draw from './draw'
import cucoloris from './cucoloris'
import lqip from './lqip'
import sqip from './sqip'
import webp from 'webp-converter'
import * as path from 'path'
import { rmSync, mkdirSync } from 'fs'
import { createUnplugin } from 'unplugin'

const outputDir = path.join(process.cwd(), 'node_modules', 'magic-img-output')

try {
	rmSync(outputDir, { recursive: true, force: true })
} catch(e) {
	console.log(e)
} finally {
	mkdirSync(outputDir)
}

export default createUnplugin((options: Options = {}): any => {
	webp.grant_permission()
	const webpCacheMap = new Map<string, [Promise<Buffer>, string]>()
	const cacheMap = new Map<string, string>()
	const includeReg = /\.(png|gif|jpeg|jpg|webp)($|\?)/
	const magicReg = /([^?]+)\?([^'"?]+)/g
	const pathReg = /('|")([^'"?]+)/g
	const transformMap = {
		draw,
		cucoloris,
		lqip,
		sqip
	}

	return {
		name: 'unplugin-magic-img',
		transformInclude(id: string) {
			return includeReg.test(id) && /magic=(draw|cucoloris|lqip|sqip)/.test(id)
		},
		async transform(code: string, id: string) {
			if (cacheMap.has(id)) return cacheMap.get(id)

			const [[, filePath, params = {}] = []] = Array.from(id.matchAll(magicReg))
			let convertFilePath = filePath
			if (filePath.includes('.webp')) {
				if (webpCacheMap.has(filePath)) {
					const [task, outputFile] = webpCacheMap.get(filePath)
					await task
					convertFilePath = outputFile
				} else {
					const outputFile = path.join(outputDir, `${Date.now()}.jpg`)
					const task = webp.dwebp(filePath, outputFile, "-o")
					webpCacheMap.set(filePath, [task, outputFile])
					await task
					convertFilePath = outputFile
				}
			}
			const { magic, ...customParams } = Object.fromEntries(new URLSearchParams(params).entries())
			const { width = 0, height = 0, width_ = 0, height_ = 0, content } = await transformMap[magic](convertFilePath, { ...options[magic], ...customParams })

			// module.exports = __webpack_public_path__ + "img/lls.c7d4fb6b.jpg";
			// export default "/magic-img/src/assets/lls.jpg?magic=draw"
			const [match] = Array.from(code.matchAll(pathReg))
			let str = 'const src = '
			if (code.includes('__webpack_public_path__')) {
				str += `__webpack_public_path__ + "${match[2]}"`
			} else {
				str += `"${match[2].endsWith('$_') ? match[2].slice(0, match[2].length - 2) : match[2]}"`
			}

			cacheMap.set(id, `
      ${str}
      export default JSON.stringify({
        src,
        magic: '${magic}',
        width: ${width},
        height: ${height},
        width_: ${width_},
        height_: ${height_},
        content: '${content}',
      })`)

			return cacheMap.get(id)
		}
	}
})