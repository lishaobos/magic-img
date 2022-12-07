import * as jimp from 'jimp'
import type { LqipOptions } from './type'

const mimeType = {
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
}

export default async function (filePath: string, params: LqipOptions) {
  const { width = 20, height = jimp.AUTO } = params
  const [[, type]] = Array.from(filePath.matchAll(/\.(jpg|jpeg|png|gif|webp)/g))
  const image = await jimp.read(filePath)
  const img = image.resize(+width, +height)
  const buffer = await img.getBufferAsync(mimeType[type])
  const content = `data:${mimeType[type]};base64,${buffer.toString("base64")}`
  
  return {
    content
  }
}