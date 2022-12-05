import potrace from 'potrace'
import * as jimp from 'jimp'

type Params = {
  filePath: string
}

const defaultOptions = {
  background: '#fff',
  color: '#c7d4d8',
  threshold: 120
}

export default async function (params: Params) {
  const data = await jimp.read(params.filePath)
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