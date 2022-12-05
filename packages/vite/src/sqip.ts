import sqip from 'sqip'

type Params = {
  filePath: string
}

const detaultOptions = {
  numberOfPrimitives: 50,
  blur: 2,
  mode: 0
}

export default async function (params: Params) {
  const { final_svg: svg, img_dimensions: data } = await sqip({
    ...detaultOptions,
    filename: params.filePath
  });

  return {
    content: svg.replace('</svg>', '').replace(/<svg([^<]+)/g, ''),
    width: data.width,
    height: data.height,
  }
}