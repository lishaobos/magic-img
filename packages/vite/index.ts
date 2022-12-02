import { Plugin } from 'vite'
import draw from './src/draw/index'

export default function (): Plugin[] {
  return [
    draw()
  ]
}