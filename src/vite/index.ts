import type { Plugin } from 'vite'
import type { Options } from './type'
import draw from './draw'
import cucoloris from './cucoloris'
import lqip from './lqip'
import sqip from './sqip'

export default function (options: Options): Plugin {
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
      const { magic, ...customParams } = Object.fromEntries(new URLSearchParams(params).entries())
      const { width = 0, height = 0, content } = await transformMap[magic](filePath, { ...options[magic], ...customParams })
      const [match] = Array.from(code.matchAll(pathReg));
      const str = isDev ? `import src from '${match[2]}'` : `const src = '${match[2].slice(0, match[2].length - 2)}'`
      cacheMap.set(id, `
      ${str}
      export default JSON.stringify({
        src,
        magic: '${magic}',
        width: ${width},
        height: ${height},
        content: '${content}',
      })`)

      return cacheMap.get(id)
    }
  }
}