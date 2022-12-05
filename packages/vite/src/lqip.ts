import lqip from 'lqip'

type Params = {
  filePath: string
}

export default async function (params: Params) {
  const content = await lqip.base64(params.filePath)
  return {
    content
  }
}