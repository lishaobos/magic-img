import potrace from 'potrace'
import jimp from 'jimp'
import type { CucolorisOptions } from './type'

const defaultOptions = {
  background: '#fff',
  color: '#c7d4d8',
  threshold: 100
}

export default async function (filePath: string, params: CucolorisOptions) {
  const { w = 400, h = jimp.AUTO } = params
  const image = await jimp.read(filePath)
  const img = image.resize(+w, +h)
  const trace = new potrace.Potrace()
  const options = {
    ...defaultOptions,
    ...params,
  }
  options.threshold = Number(options.threshold)
  trace.setParameters(options)
  const content = await new Promise(r => {
    trace.loadImage(img.bitmap, () => {
      r(trace.getPathTag())
    })
  })

  return {
    content,
    width: img.bitmap.width,
    height: img.bitmap.height
  }
}