import type { Point, Line, Lines, PointMap, DrawOptions } from '../../type'
import { Directions } from '../../type'
import { CannyJS } from './canny'
import getPixels from 'get-pixels'
import images from 'images'

const directions = [
  Directions.Left,
  Directions.LeftTop,
  Directions.Top,
  Directions.TopRight,
  Directions.Right,
  Directions.RightBottom,
  Directions.Bottom,
  Directions.BottomLeft,
]

const compose = (...fncs: ((...args: any) => any)[]) => (...args: any[]) => fncs.reduce((p, n, i) => i ? n(p) : n(...p), args)

const getPointByDirection = ([x, y]: Point, dirction: Directions): Point => {
  switch (dirction) {
    case Directions.Left:
      return [x - 1, y]
    case Directions.LeftTop:
      return [x - 1, y - 1]
    case Directions.Top:
      return [x, y - 1]
    case Directions.TopRight:
      return [x + 1, y - 1]
    case Directions.Right:
      return [x + 1, y]
    case Directions.RightBottom:
      return [x + 1, y + 1]
    case Directions.Bottom:
      return [x, y + 1]
    case Directions.BottomLeft:
      return [x - 1, y + 1]
  }
}

const getPoints = (imgData: number[], w: number, h: number): PointMap => {
  const pointMap: PointMap = new Map()
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = x * 4 + y * w * 4

      if (imgData[i] === 255) pointMap.set(`${x}-${y}`, [x, y])
    }
  }

  return pointMap
}

const getLines = (pointMap: PointMap) => {
  const pointCache = new Map<string, true>()
  const lines: Lines = []
  const { random } = Math
  for (const [x, y] of pointMap.values()) {
    if (pointCache.has(`${x}-${y}`)) continue

    directions.sort(() => random() - random())
    const line: Line = []
    let start: Point = [x, y]
    line.push(start)
    pointCache.set(`${x}-${y}`, true)
    let i = 0
    while (i < directions.length) {
      const [x, y] = getPointByDirection(start, directions[i])
      if (!pointMap.has(`${x}-${y}`) || pointCache.has(`${x}-${y}`)) {
        i++
        continue
      }
      
      line.push(start = [x, y])
      pointCache.set(`${x}-${y}`, true)
    }

    if (line.length > 2) {
      lines.push(line)
      // const optimizedLine = new Set<Point>()
      // line.reduce((p: Point | Directions, n, i, arr) => {
      //   const dirction = getDirection(arr[i - 1], arr[i])

      //   if (i === 1) {
      //     optimizedLine.add(arr[i - 1])
      //   }
      //   if (p as Directions !== dirction) {
      //     optimizedLine.add(arr[i - 1])
      //   }

      //   return dirction
      // })
       
      // optimizedLine.add(line.at(-1) as Point)
      // lines.push(Array.from(optimizedLine.values()))
    }
  }

  return lines
}

const getDirection = ([x1, y1]: Point, [x2, y2]: Point) => {
  const [x, y] = [x2 - x1, y2 - y1]

  if (x > 0 && y > 0) return Directions.RightBottom
  else if (x > 0 && y === 0) return Directions.Right
  else if (x > 0 && y < 0) return Directions.TopRight
  else if (x === 0 && y > 0) return Directions.Bottom
  else if (x === 0 && y < 0) return Directions.Top
  else if (x < 0 && y < 0) return Directions.LeftTop
  else if (x < 0 && y === 0) return Directions.Left
  else if (x < 0 && y > 0) return Directions.BottomLeft
}

const createPolyLines = (lines: Lines) => {
  return lines.map(line => `<polyline style="--offset:${line.length}" points="${line.map(point => point.join(",")).join(" ")}" fill="none" ></polyline>`).join("")
}

const getPolyLines: (imgData: number[], w: number, h: number) => string = compose(
  getPoints,
  getLines,
  createPolyLines
)

export default async function (filePath: string, params: DrawOptions) {
  const img = images(filePath);
  const scaleImg = img.size(Math.min(img.width(), params.max || 400));
  const buffer = scaleImg.encode('jpg')
  const { data, shape: [width, height] } = await new Promise<{data: number[], shape: [number, number]}>(r => {
    getPixels(buffer, 'image/jpg', (err, pix) => {
      r(pix)
    })
  })
  const canny = CannyJS.canny({ width, height, data }, 80, 10, 1.4, 3);
  const content = getPolyLines(canny.toImageDataArray(), width, height);

  return {
    content,
    width,
    height
  }
}