import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  failOnWarn: false,
  entries: [
    './index',
  ],
  declaration: true,
  externals: ['vite'],
  rollup: {
    emitCJS: true
  }
})