import potrace from 'potrace'
import * as jimp from 'jimp'
import type { CucolorisOptions } from '../type'

const defaultOptions = {
  background: '#fff',
  color: '#c7d4d8',
  threshold: 120
}

export default async function (filePath: string, params: CucolorisOptions) {
  const data = await jimp.read(filePath)
  const trace = new potrace.Potrace()
  trace.setParameters({
    ...defaultOptions,
    ...params,
  })
  const content = await new Promise(r => {
    trace.loadImage(data.bitmap, () => {
      r(trace.getPathTag())
    })
  })

  return {
    content,
    width: data.bitmap.width,
    height: data.bitmap.height
  }
}