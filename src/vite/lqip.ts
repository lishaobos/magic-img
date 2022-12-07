import * as jimp from 'jimp'
import type { LqipOptions } from './type'

const mimeType = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
}

export default async function (filePath: string, params: LqipOptions) {
  const { w = 20, h = jimp.AUTO } = params
  const [[, type]] = Array.from(filePath.matchAll(/\.(jpg|jpeg|png|gif|webp)/g))
  const image = await jimp.read(filePath)
  const width = image.getWidth()
  const height = image.getHeight()
  const img = image.resize(+w, +h)
  const buffer = await img.getBufferAsync(mimeType[type])
  const content = `data:${mimeType[type]};base64,${buffer.toString("base64")}`
  
  return {
    width,
    height,
    content
  }
}