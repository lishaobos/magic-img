import lqip from 'lqip'

export default async function (filePath: string) {
  const content: string = await lqip.base64(filePath)
  return {
    content
  }
}