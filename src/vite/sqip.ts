import sqip from 'sqip'
import type { SqipOptions } from '../type'

const detaultOptions = {
  numberOfPrimitives: 20,
  blur: 2,
  mode: 0
}

export default async function (filename: string, params: SqipOptions) {
  const { final_svg: svg, img_dimensions: data } = await sqip({
    filename,
    ...detaultOptions,
    ...params
  });

  return {
    content: svg.replace('</svg>', '').replace(/<svg([^<]+)/g, ''),
    width: data.width,
    height: data.height,
  }
}