export type Point = [number, number]

export type Line = Point[]

export type Lines = Line[]

export type PointMap = Map<string, Point>

export enum Directions {
  Left,
  LeftTop,
  Top,
  TopRight,
  Right,
  RightBottom,
  Bottom,
  BottomLeft,
}