import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  failOnWarn: false,
  entries: [
    {
      builder: 'mkdist',
      input: './src/assets',
      outDir: './dist'
    },
    './src/index',
  ],
  externals: ['vite'],
  declaration: true,
  rollup: {
    emitCJS: true
  }
})