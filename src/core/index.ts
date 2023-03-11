import type { Options } from './type'
import draw from './draw'
import cucoloris from './cucoloris'
import lqip from './lqip'
import sqip from './sqip'
import blurhash from './blurhash'
import webp from 'webp-converter'
import * as path from 'path'
import { rmSync, mkdirSync, promises as fp } from 'fs'
import { createUnplugin } from 'unplugin'
import fetch from 'node-fetch'

const outputDir = path.join(process.cwd(), 'node_modules', 'magic-img-output')

export enum mimeType {
	jpeg = "image/jpeg",
	jpg = "image/jpeg",
	png = "image/png",
	gif = "image/gif",
}

try {
	rmSync(outputDir, { recursive: true, force: true })
} catch(e) {
	console.log(e)
} finally {
	mkdirSync(outputDir)
}

export default createUnplugin((options: Options = {}, meta): any => {
	webp.grant_permission()
	const asyncTaskCacheMap = new Map<string, Promise<string>>()
	const cacheMap = new Map<string, string>()
	const includeReg = /magic=(draw|cucoloris|lqip|sqip|blurhash)/
	const magicReg = /([^?]+)\?(.+)/g
	const pathReg = /('|")([^'"?]+)/g
	// const magicRemoteReg = /magic-img@(.+)\?(.+)/g
	const isRemoteUrl = (path: string) => path.includes('magic-img@')
	const transformMap = {
		draw,
		cucoloris,
		lqip,
		sqip,
		blurhash
	}

	async function loadImg (url: string) {
		const res = await fetch(url)
		const resourceType = res.headers.get('content-type')
		const suffix = `.${mimeType[resourceType] || 'jpg'}`
		const aBuffer = await res.arrayBuffer()
		const buffer = Buffer.from(aBuffer)
		const filePath = path.join(outputDir, `${Date.now()}${suffix}`)
		await fp.writeFile(filePath, buffer)
		return filePath
	}

	async function decodeWebp (filePath: string) {
		if (!filePath.includes('.webp')) return filePath

		const output = path.join(outputDir, `${Date.now()}.jpg`)
		await webp.dwebp(filePath, output, "-o")
		return output
	}

	async function getAsyncRes<T extends () => Promise<string>>(taskId: string, task: T) {
		if (!asyncTaskCacheMap.get(taskId)) {
			asyncTaskCacheMap.set(taskId, task())
		}

		return await asyncTaskCacheMap.get(taskId)
	}

	async function transform_(code:string, id: string) {
		// webpack5
		if (id.includes('virtual_magic-img')) id = decodeURIComponent(id)
		if (cacheMap.has(id)) return cacheMap.get(id)
			
		const isRemote = isRemoteUrl(id)
		const [[, filePath, params = {}] = []] = Array.from(id.matchAll(isRemote ? /magic-img@(.+)\?(.+)/g : magicReg))
		let convertFilePath = filePath
		isRemote && (convertFilePath = await getAsyncRes(convertFilePath, () => loadImg(convertFilePath)))
		convertFilePath = await getAsyncRes(convertFilePath, () => decodeWebp(convertFilePath))
		const { magic, ...customParams } = Object.fromEntries(new URLSearchParams(params).entries())
		const { width = 0, height = 0, width_ = 0, height_ = 0, content } = await transformMap[magic](convertFilePath, { ...options[magic], ...customParams })
		const [match] = Array.from(code.matchAll(pathReg))

		let str = 'const src = '
		if (isRemote) {
			str += `"${filePath}"`
		} else if (code.includes('__webpack_public_path__')) {
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

	return {
		name: 'unplugin-magic-img',
		// vite webpack 远程解析入口
		resolveId(source: string) {
			if (!isRemoteUrl(source)) return null

			return '\0' + source
		},
		loadInclude(id: string) {
			return isRemoteUrl(id)
		},
		async load(id: string) {
			return {
				code: await transform_('', id),
				moduleSideEffects: false
			}
		},
		transformInclude(id: string) {
			return includeReg.test(id)
		},
		transform: transform_
	}
})