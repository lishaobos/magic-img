import type { Plugin } from 'vite'
import type { Options } from './type'
import draw from './draw'
import cucoloris from './cucoloris'
import lqip from './lqip'
import sqip from './sqip'
import webp from 'webp-converter'
import * as path from 'path'
import { rmSync, mkdirSync } from 'fs'

const outputDir = path.join(process.cwd(), 'node_modules', 'magic-img-output')

try {
  rmSync(outputDir, { recursive: true, force: true })
} catch(e) {
  console.log(e)
} finally {
  mkdirSync(outputDir)
}
  
export default function (options: Options = {}): Plugin {
  webp.grant_permission()
  const webpCacheMap = new Map<string, [Promise<Buffer>, string]>()
  const cacheMap = new Map<string, string>()
  const includeReg = /\.(png|gif|jpeg|jpg|webp)($|\?)/
  const magicReg = /([^?]+)\?([^'"?]+)/g
  const pathReg = /('|")([^'"]+)(\?magic)/g
  let isDev = true
  const transformMap = {
    draw,
    cucoloris,
    lqip,
    sqip
  }

  return {
    name: 'magic-img:scan',
    config(config, env) {
      isDev = env.mode === 'development'
    },
    async transform(code, id) {
      if (cacheMap.has(id)) return cacheMap.get(id)
      if (!includeReg.test(id) || !/magic=(draw|cucoloris|lqip|sqip)/.test(id)) return code

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
      const [match] = Array.from(code.matchAll(pathReg));
      const str = isDev ? `import src from "${match[2]}"` : `const src = "${match[2].slice(0, match[2].length - 2)}"`
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
}