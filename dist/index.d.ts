import { Plugin } from 'vite';

declare function install(): void;

declare enum Mode {
    combo = 0,
    triangle = 1,
    rect = 2,
    ellipse = 3,
    rotatedrect = 4,
    beziers = 5,
    rotatedellipse = 6,
    polygon = 7
}
type SqipOptions = {
    numberOfPrimitives: number;
    blur: number;
    mode: Mode;
};
type CucolorisOptions = {
    background: string;
    color: string;
    threshold: number;
};
type DrawOptions = {
    max: number;
};
type Options = {
    sqip: SqipOptions;
    cucoloris: CucolorisOptions;
    draw: DrawOptions;
};

declare function export_default(options: Options): Plugin;

export { install, export_default as vite };
